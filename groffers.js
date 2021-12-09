const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

let doc = [];

async function find() {
    try {
      let res = await axios.get(`https://grofers.com/v6/merchant/29668/product/333324?current_screen=pdp`);
      const prods = res.data.objects[1].data.products;
      prods.forEach(prod => {
          const name = prod.line_1;
          const brand = prod.brand || 'No brand';
          const price = prod.price;
          const mrp = prod.mrp;
          const imgLink = prod.image_url;
          const rating = prod.rating;

          const finalAns = {name, brand, price, mrp, imgLink, rating}
          doc.push(finalAns)
      });

      const j2cp = new json2csv();
      const csv = j2cp.parse(doc);
      fs.appendFile("file.csv", csv, function (err) {
        if (err) throw err;
           console.log("Saved!");
        });
    }
    catch(e)
    {
        console.log(e)
    }
}

find();
