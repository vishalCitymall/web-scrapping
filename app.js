const axios = require('axios')
const cheerio = require('cheerio')

// axios.get('https://meesho.com/topwear-men/pl/zcm6l?page=2')
// .then(res => {
//     const $ = cheerio.load(res.data);
//     let data = []
//     $('.sc-dkPtRN').each((index , element) => {
//         const title = $(element).children('a').children('.Card__BaseCard-sc-b3n78k-0').children('.NewProductCard__ProductImage-sc-j0e7tu-14').children().children('img').attr('alt')
//         const imgLink = $(element).children('a').children('.Card__BaseCard-sc-b3n78k-0').children('.NewProductCard__ProductImage-sc-j0e7tu-14').children().children('img').attr('src')
//         const price = $(element).children('a').children('.Card__BaseCard-sc-b3n78k-0').children('.NewProductCard__DetailCard_Desktop-sc-j0e7tu-2').children('.NewProductCard__PriceRow-sc-j0e7tu-5').children('h5').first().text()
//         const discount = $(element).children('a').children('.Card__BaseCard-sc-b3n78k-0').children('.NewProductCard__DetailCard_Desktop-sc-j0e7tu-2').children('.NewProductCard__DiscountRow-sc-j0e7tu-15').children('p').first().text()
//         const rating = $(element).children('a').children('.Card__BaseCard-sc-b3n78k-0').children('.NewProductCard__DetailCard_Desktop-sc-j0e7tu-2').children('.NewProductCard__RatingsRow-sc-j0e7tu-6').children('.NewProductCard__RatingSection-sc-j0e7tu-7').children('span').children('span').first().text()

//         data[index] = {title , imgLink, price, discount, rating}
//         console.log(data)
//         //data[index] = response
//     })
// })
// .catch(console.log('data not found!'))

let products = []
for(let pageNumber = 1 ; pageNumber<=1000 ; pageNumber++)
{
    axios({
    method: 'post',
    url: 'https://meesho.com/api/1.0/products',
    headers: {}, 
    data: {
        "page_id":"zcm6l",
        "page": pageNumber,
        "offset":20,
        "limit":20
    }
    })
    .then(res => {
      const response = res.data.payload.products
      for(let i = 0; i < response.length; i++)
        {
          const name = response[i].name
          const price = response[i].price
          const discount = response[i].discount
          const img = response[i].images
          let rating = response[i].supplier_reviews_summary
          if(rating == undefined)
          {
             rating = '0'
          }
          else
          {
              rating = rating.average_rating 
          }
          var ans = {name, price, discount, img, rating}
          products.push(ans);
          //console.log(ans); 
        }
        return products;
    })
    .then(prod => {
        console.log(prod.length)
    })
    .catch(error => console.log(error))
}

