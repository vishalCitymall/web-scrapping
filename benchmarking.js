const csv = require('csv-parser');
const fs = require('fs');

const filepath = "./Benchmarking - KVI.csv"

let doc = []
async function find(){
    try{
    fs.createReadStream(filepath)
    .on('error', () => {
        // handle error
    })

    .pipe(csv())
    .on('data', (row) => {
         doc.push(row)
    })
    .on('end', () => {
        console.log(doc)
    })
}
catch{
    console.log("not")
}

}

find();