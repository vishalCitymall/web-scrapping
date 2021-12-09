const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

let doc = [];

async function find() {
    try {
      let res = await axios.get(`https://prodsearch.tatacliq.com/products/mpl/search/?searchText=%3Arelevance%3Acategory%3AMSH1210%3AinStockFlag%3Atrue%3AisLuxuryProduct%3Afalse%3Abrand%3AMBH12E00008&isKeywordRedirect=true&isKeywordRedirectEnabled=false&channel=WEB&isMDE=true&isTextSearch=false&isFilter=false&qc=false&test=mm.new&page=0&isSuggested=false&isPwa=true&pageSize=40&typeID=all`);
      const prods = res.data.searchresult;
      for (const prod of prods) {
          const name = prod.productname;
          const brand = prod.brandname;
          const price = prod.price.sellingPrice.formattedValue;
          const mrp = prod.price.mrpPrice.formattedValue;
          const imgLink = prod.imageURL;
          const rating = prod.averageRating;

          const finalAns = {name, brand, price, mrp, imgLink, rating}
          doc.push(finalAns)
        };
      console.log(doc);
    //   const j2cp = new json2csv();
    //   const csv = j2cp.parse(doc);
    //   fs.appendFile("file3.csv", csv, function (err) {
    //     if (err) throw err;
    //        console.log("Saved!");
    //     });
    }
    catch(e)
    {
        console.log(e)
    }
}

find();
