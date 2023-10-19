const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// watches-server
// epL9aEV5pGHVuyAz

const uri =
  "mongodb+srv://watches-server:epL9aEV5pGHVuyAz@cluster0.cxghft2.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();

    const watchesCollection = client.db("watchesDB").collection("watches");
    const brandsCollection = client.db("watchesDB").collection("brands");

    // insert watches in mongoDB.
    app.post("/watches", async (req, res) => {
      const watch = req.body;
      console.log(watch);
      const result = await watchesCollection.insertOne(watch);
      res.send(result);
    });
    // get all the watch
    app.get("/watches", async (req, res) => {
      const query = watchesCollection.find();
      const result = await query.toArray();
      res.send(result);
    });
    //  get one watch
    app.get("/watch/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const watches = await watchesCollection.findOne(query)
      res.send(watches);
    });
    // get brand data
    app.get("/watchBrand/:brand", async (req, res) => {
      const brand = req.params.brand;
      const query = { brand: brand };
      const watches = await watchesCollection.find(query).toArray();
      res.send(watches);
    });

    // insert all brands in mongoDB.
    app.post("/brands", async (req, res) => {
      const brands = [
        {
          image:
            "https://media.wired.com/photos/6081f4280c9b5877078878e2/16:9/w_2399,h_1349,c_limit/business_plaintext_apple_1313768378.jpg",
          name: "Rolex",
        },
        {
          image:
            "https://media.wired.com/photos/6081f4280c9b5877078878e2/16:9/w_2399,h_1349,c_limit/business_plaintext_apple_1313768378.jpg",
          name: "Apple",
        },
        {
          image:
            "https://media.wired.com/photos/6081f4280c9b5877078878e2/16:9/w_2399,h_1349,c_limit/business_plaintext_apple_1313768378.jpg",
          name: "Casio",
        },
        {
          image:
            "https://media.wired.com/photos/6081f4280c9b5877078878e2/16:9/w_2399,h_1349,c_limit/business_plaintext_apple_1313768378.jpg",
          name: "Omega",
        },
        {
          image:
            "https://media.wired.com/photos/6081f4280c9b5877078878e2/16:9/w_2399,h_1349,c_limit/business_plaintext_apple_1313768378.jpg",
          name: "Seiko",
        },
        {
          image:
            "https://media.wired.com/photos/6081f4280c9b5877078878e2/16:9/w_2399,h_1349,c_limit/business_plaintext_apple_1313768378.jpg",
          name: "Citizen",
        },
      ];
      const result = await brandsCollection.insertMany(brands);
      res.send(result);
    });

    // get all the brands
    app.get("/brands", async (req, res) => {
      const query = brandsCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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
  res.send("Watches site is Running.....!");
});

app.listen(port, () => {
  console.log(`Watches Tell site is Running on port ${port}`);
});
