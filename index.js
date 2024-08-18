const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, CURSOR_FLAGS } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tech-tide.web.app",
      "https://tech-tide.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uqi3nbn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db("techTide").collection("products");

    app.get("/products", async (req, res) => {
      const { brand, category, minPrice, maxPrice, search, currentPage, sort } =
        req.query;
      let query = {};
      let sortOPtion = {};

      if (search) {
        query.ProductName = { $regex: search, $options: "i" };
      }

      if (sort === "highToLow") {
        sortOPtion.PriceInTaka = -1;
      }
      if (sort === "LowToHigh") {
        sortOPtion.PriceInTaka = 1;
      }
      if (sort === "new") {
        sortOPtion.ProductCreationDate = -1;
      }
      if (sort === "new") {
        sortOPtion.ProductCreationTime = -1;
      }

      if (brand) {
        query.BrandName = brand;
      }

      if (category) {
        query.Category = category;
      }

      if (minPrice || maxPrice) {
        query.PriceInTaka = {};
        if (minPrice) query.PriceInTaka.$gte = parseFloat(minPrice);
        if (maxPrice) query.PriceInTaka.$lte = parseFloat(maxPrice);
      }

      const limit = 9;
      const skip = parseInt(currentPage) * limit;
      const result = await productCollection
        .find(query)
        .sort(sortOPtion)
        .skip(skip)
        .limit(limit)
        .toArray();
      res.send(result);
    });

    // sorting
    app.get("/products/:sort", async (req, res) => {
      const r = req.params.sort;
      const sort = r.split(",");
      const [property, value] = sort;

      const sortOption = {
        [property]: parseInt(value, 10),
      };

      const products = await productCollection
        .find({})
        .sort(sortOption)
        .toArray();
      res.send(products);
    });

    // Pagination endpoint
    app.get("/totalProducts", async (req, res) => {
      const { brand, category, minPrice, maxPrice, search } = req.query;
      let query = {};

      if (search) {
        query.ProductName = { $regex: search, $options: "i" };
      }

      if (brand) {
        query.BrandName = brand;
      }

      if (category) {
        query.Category = category;
      }

      if (minPrice || maxPrice) {
        query.PriceInTaka = {};
        if (minPrice) query.PriceInTaka.$gte = parseFloat(minPrice);
        if (maxPrice) query.PriceInTaka.$lte = parseFloat(maxPrice);
      }

      const count = await productCollection.countDocuments(query);
      res.send({ count });
    });

    // Filtering endpoint with brand name, category, and price range
    app.get("/product/Categorization", async (req, res) => {
      const { brand, category, minPrice, maxPrice } = req.query;
      let query = {};

      if (brand) {
        query.BrandName = brand;
      }

      if (category) {
        query.Category = category;
      }

      if (minPrice || maxPrice) {
        query.PriceInTaka = {};
        if (minPrice) query.PriceInTaka.$gte = parseFloat(minPrice);
        if (maxPrice) query.PriceInTaka.$lte = parseFloat(maxPrice);
      }

      if (Object.values(query).length === 0) {
        return;
      }
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
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
