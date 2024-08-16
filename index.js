const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uqi3nbn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db("techTide").collection("products");

    app.get("/products", async (req, res) => {
        
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });



    // Endpoint to fetch products with optional search by name
    app.get("/products/search/:query", async (req, res) =>{
        const {query} = req.params;
        const result = await productCollection.find({ProductName:{$regex:query,$options:"i"}}).toArray();
        res.send(result);


    })



    // sorting
    app.get("/products/:sort", async (req, res) => {
        // const { brand, category, minPrice, maxPrice, sort } = req.query;
        const sort= req.params.sort
        const query = {};

        let sortOption = {};
        if (sort === "priceLowHigh") sortOption.PriceInTaka = 1;
        if (sort === "priceHighLow") sortOption.PriceInTaka = -1;
        if (sort === "dateNewest") sortOption.ProductCreationDate = -1;

        const products = await productCollection.find(query).sort(sortOption).toArray();
        res.send(products);
    });


      // Pagination endpoint
      
      




        // Filtering endpoint with brand name, category, and price range
    // app.get("/product/Categorization", async (req, res) => {
    //     const {brand, category, minPrice, maxPrice} = req.query;
    //     let query = {};

    //     if (brand) {
    //       query.BrandName = brand;
    //     }
  
    //     if (category) {
    //       query.Category = category;
    //     }
        
    //     if (minPrice || maxPrice) {
    //       query.PriceInTaka = {};
    //       if (minPrice) query.PriceInTaka.$gte = parseFloat(minPrice);
    //       if (maxPrice) query.PriceInTaka.$lte = parseFloat(maxPrice);
    //     }
  
        
    //     const result = await productCollection.find(query).toArray();
    //     res.send(result);
    //   });





    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Tech tide is running");
  });
  
  app.listen(port, () => {
    console.log(`Tech tide Server is running on port ${port}`);
  });