const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

let doc = [];

async function find() {
  try {
    for (let pageNumber = 1; pageNumber <= 1; pageNumber++) {
      let res = await axios.get(
        `https://meesho.com/mobiles-and-accessories/pl/9y6n7?page=${pageNumber}`
      );
      const $ = cheerio.load(res.data);
      $(".sc-dkPtRN").each((index, element) => {
        const title = $(element)
          .children("a")
          .children(".Card__BaseCard-sc-b3n78k-0")
          .children(".NewProductCard__ProductImage-sc-j0e7tu-14")
          .children()
          .children("img")
          .attr("alt");
        const imgLink = $(element)
          .children("a")
          .children(".Card__BaseCard-sc-b3n78k-0")
          .children(".NewProductCard__ProductImage-sc-j0e7tu-14")
          .children()
          .children("img")
          .attr("src");
        const price = $(element)
          .children("a")
          .children(".Card__BaseCard-sc-b3n78k-0")
          .children(".NewProductCard__DetailCard_Desktop-sc-j0e7tu-2")
          .children(".NewProductCard__PriceRow-sc-j0e7tu-5")
          .children("h5")
          .first()
          .text();
        const discount = $(element)
          .children("a")
          .children(".Card__BaseCard-sc-b3n78k-0")
          .children(".NewProductCard__DetailCard_Desktop-sc-j0e7tu-2")
          .children(".NewProductCard__DiscountRow-sc-j0e7tu-15")
          .children("p")
          .first()
          .text();
        let rating = $(element)
          .children("a")
          .children(".Card__BaseCard-sc-b3n78k-0")
          .children(".NewProductCard__DetailCard_Desktop-sc-j0e7tu-2")
          .children(".NewProductCard__RatingsRow-sc-j0e7tu-6")
          .children(".NewProductCard__RatingSection-sc-j0e7tu-7")
          .children("span")
          .children("span")
          .first()
          .text();
        if (rating === "") {
          rating = "0";
        }
        const data = { title, imgLink, price, discount, rating };
        if (data.title !== undefined) {
          doc.push(data);
        }
      });
    }

    // const j2cp = new json2csv();
    // const csv = j2cp.parse(doc);
    // fs.appendFile("message5.csv", csv, function (err) {
    //   if (err) throw err;
    //   console.log("Saved!");
    // });
  } catch (err) {
    console.log(err);
  }
}

find();
