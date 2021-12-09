require('dotenv').config()
const axios = require("axios");
const fs = require("fs");
const json2csv = require("json2csv").Parser;
const nodeCron = require('node-cron')
const express = require("express");
const mongodb = require('mongodb')

const url = 'mongodb+srv://vishalCitymall:vishal12345@cluster0.v408j.mongodb.net/test';
var dbConn;
mongodb.MongoClient.connect(url, {
    useUnifiedTopology: true,
}).then((client) => {
    console.log('DB Connected!');
    dbConn = client.db();
}).catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
});

let doc = [];

const port = process.env.PORT || 3000
const tataCliqTelevision = express();

async function find() {
    try {
      for(let pageNumber=0 ; pageNumber<=8 ; pageNumber++){
      let res = await axios.get(`https://prodsearch.tatacliq.com/products/mpl/search/?searchText=%3Arelevance%3Acategory%3AMSH1216%3AinStockFlag%3Atrue&isKeywordRedirect=true&isKeywordRedirectEnabled=false&channel=WEB&isMDE=true&isTextSearch=false&isFilter=false&qc=false&test=mm.new&page=${pageNumber}&isSuggested=false&isPwa=true&pageSize=40&typeID=all`);
      const prods = res.data.searchresult;
      for(const prod of prods){
          const name = prod.productname;
          const brand = prod.brandname;
          const price = prod.price.sellingPrice.formattedValue;
          const mrp = prod.price.mrpPrice.formattedValue;
          const imgLink = prod.imageURL;
          const rating = prod.averageRating || 0;
          const totalRatings = prod.ratingCount;
          const totalReviews = prod.totalNoOfReviews;
          const web_url = 'https://www.tatacliq.com' + prod.webURL
          const prodId = prod.productId
          const features = await axios.get(`https://www.tatacliq.com/marketplacewebservices/v2/mpl/products/productDetails/${prodId}?isPwa=true&isMDE=true&strategy=new`);
          const resolution = features.data.details[0].value;
          const display = features.data.details[1].value;
          const speaker = features.data.details[2].value;
          const operating_system = features.data.details[3].value;
          const model_number = features.data.details[4].value;
          let screen_size = features.data.highlights;
          if(screen_size !== undefined)
          {
            screen_size = features.data.highlights[0].shortDescription;
          }
          const finalAns = {name, brand, price, mrp, imgLink, rating, totalRatings, totalReviews, web_url, resolution, display, speaker,operating_system,model_number, screen_size}
          doc.push(finalAns)
      };
    }
      // //console.log(doc)
      // const j2cp = new json2csv();
      // const csv = j2cp.parse(doc);
      // fs.appendFile("televison1.csv", csv, function (err) {
      //   if (err) throw err;
      //      console.log("Saved!");
      //      console.log(new Date().toLocaleString());
      //   });

      const collectionName = 'television';
      const collection = dbConn.collection(collectionName);
      collection.insertMany(doc, (err, result) => {
         if (err) console.log(err);
         if(result){
             console.log('Import CSV into database successfully.');
         }
     });

    }
    catch(e)
    {
        console.log(e)
    }
}

const job = nodeCron.schedule("0 10 * * *", find)

tataCliqTelevision.get('/' , (req , res) => {
  res.send("hello world")
})

tataCliqTelevision.listen(port);