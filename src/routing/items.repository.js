import { getDB } from "../config/database.js";

let collectionName = "Items";

export default class ItemRepo {
  //initialize schema
  async addMany(data) {
    try {
      let db = await getDB();
      let collection = db.collection(collectionName);
      await collection.insertMany(data);
    } catch (error) {
      throw new Error("Error in addMany function \n" + error);
    }
  }

  //to get result based on month title description and price
  async filter(month, title, description, price) {
    try {
      let db = await getDB();
      let collection = db.collection(collectionName);
      let query = {};
      if (title) query.title = title;
      if (description) query.description = description;
      if (price) query.price = parseFloat(price);

      let data = await collection.find().toArray();
      data = data.filter((item) => {
        return parseInt(item.dateOfSale.substring(5, 7)) == month;
      });
      return data;
    } catch (error) {
      throw new Error("Error in filter function \n" + error);
    }
  }

  //sale by month
  async saleInfo(month) {
    try {
      let db = await getDB();
      let collection = db.collection(collectionName);
      const data = await collection
        .aggregate([
          {
            $addFields: {
              month: {
                $month: { $dateFromString: { dateString: "$dateOfSale" } },
              },
            },
          },
          {
            $match: {
              month: parseInt(month),
            },
          },
          {
            $group: {
              _id: null,
              totalSaleAmount: { $sum: "$price" },
              totalSoldItems: {
                $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] },
              },
              totalNotSoldItems: {
                $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] },
              },
            },
          },
          {
            $project: {
              _id: 0,
              totalSaleAmount: 1,
              totalSoldItems: 1,
              totalNotSoldItems: 1,
            },
          },
        ])
        .toArray();

      return data;
    } catch (error) {
      throw new Error("Error in saleInfo function \n" + error);
    }
  }

  //price range
  async priceRange(month) {
    try {
      let db = await getDB();
      let collection = db.collection(collectionName);
      let data = await collection
        .aggregate([
          {
            $addFields: {
              month: {
                $month: { $dateFromString: { dateString: "$dateOfSale" } },
              },
            },
          },
          {
            $match: {
              month: parseInt(month),
            },
          },
          {
            $bucket: {
              groupBy: "$price",
              boundaries: [0, 101, 201, 301, 401, 501, 601, 701, 801, 901],
              default: "901-above",
              output: {
                count: { $sum: 1 },
              },
            },
          },
          {
            $project: {
              _id: 0,
              priceRange: "$_id",
              count: 1,
            },
          },
        ])
        .toArray();

      return data;
    } catch (error) {
      throw new Error("Error in priceRange function \n" + error);
    }
  }

  //category
  async categoryByMonth(month) {
    try {
      let db = await getDB();
      let collection = db.collection(collectionName);
      let data = await collection
        .aggregate([
          {
            $addFields: {
              month: {
                $month: { $dateFromString: { dateString: "$dateOfSale" } },
              },
            },
          },
          {
            $match: {
              month: parseInt(month),
            },
          },
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              category: "$_id",
              count: 1,
            },
          },
        ])
        .toArray();

      return data;
    } catch (error) {
      throw new Error("Error in categoryByMonth function \n" + error);
    }
  }
}
