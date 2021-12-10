require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const json2csv = require("json2csv").Parser;
const nodeCron = require("node-cron");
const express = require("express");
const mongodb = require("mongodb");

const url =
  "mongodb+srv://vishalCitymall:vishal12345@cluster0.v408j.mongodb.net/test";
var dbConn;
var dbClient;

const port = process.env.PORT || 3000;
const tataCliqSplitAC = express();

async function find() {
  try {
    let doc = [];

    const client = await mongodb.MongoClient.connect(url, {
      useUnifiedTopology: true,
    });
    console.log("DB Connected!");
    dbConn = await client.db();
    dbClient = client;

    for (let pageNumber = 0; pageNumber < 11; pageNumber++) {
      let res = await axios.get(
        `https://prodsearch.tatacliq.com/products/mpl/search/?searchText=%3Arelevance%3Acategory%3AMSH1230100%3AinStockFlag%3Atrue&isKeywordRedirect=true&isKeywordRedirectEnabled=false&channel=WEB&isMDE=true&isTextSearch=false&isFilter=false&qc=false&test=mm.new&page=${pageNumber}&isSuggested=false&isPwa=true&pageSize=40&typeID=all`
      );
      const prods = res.data.searchresult;
      for (const prod of prods) {
        const name = prod.productname;
        const brand = prod.brandname;
        const price = prod.price.sellingPrice.formattedValue;
        const mrp = prod.price.mrpPrice.formattedValue;
        const imgLink = prod.imageURL;
        const rating = prod.averageRating || 0;
        const totalRatings = prod.ratingCount;
        const totalReviews = prod.totalNoOfReviews;
        const web_url = "https://www.tatacliq.com" + prod.webURL;
        const finalAns = {
          name,
          brand,
          price,
          mrp,
          imgLink,
          rating,
          totalRatings,
          totalReviews,
          web_url,
        };
        doc.push(finalAns);
      }
      console.log(pageNumber);
    }

    const collectionName = "window_SPLIT";
    const collection = dbConn.collection(collectionName);
    //collection.deleteMany({});
    await collection.insertMany(doc, (err, result) => {
      if (err) console.log(err);
      if (result) {
        console.log("Import CSV into database successfully.");
        console.log("Number of documents inserted: " + result.insertedCount);
        dbClient.close();
      }
    });
  } catch (e) {
    console.log(e);
  }
}

const job = nodeCron.schedule("*/6 * * * *", find);
//find()
tataCliqSplitAC.get("/", (req, res) => {
  res.send("hello world");
});

tataCliqSplitAC.listen(port);
