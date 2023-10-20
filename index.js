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
    const cardCollection = client.db("watchesDB").collection("card");

    // add watches Card.
    app.post("/card", async (req, res) => {
      const watch = req.body;
      console.log(watch);
      const result = await cardCollection.insertOne(watch);
      res.send(result);
    });
    // get all the watch from cards collection
    app.get("/card", async (req, res) => {
      const query = cardCollection.find();
      const result = await query.toArray();
      res.send(result);
    });
    //  get one watch from card collection
    app.get("/card/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const watches = await cardCollection.findOne(query);
      res.send(watches);
    });

    // Delete watch from card collection
    app.delete("/card/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cardCollection.deleteOne(query);
      res.send(result);
    });

    // insert watches in mongoDB.
    app.post("/watches", async (req, res) => {
      const watch = req.body;
      console.log(watch);
      const result = await watchesCollection.insertOne(watch);
      res.send(result);
    });
    // update watch data
    app.put("/watches/:id", async (req, res) => {
      const id = req.params.id;
      console.log("update", id);
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedWatch = req.body;
      const changeWatch = {
        $set: {
          image: updatedWatch.image,
          name: updatedWatch.name,
          brand: updatedWatch.brand,
          type: updatedWatch.type,
          price: updatedWatch.price,
          rating: updatedWatch.rating,
        },
      };
      const result = await watchesCollection.updateOne(
        filter,
        changeWatch,
        option
      );
      res.send(result);
    });
    // get all the watch
    app.get("/watches", async (req, res) => {
      const query = watchesCollection.find();
      const result = await query.toArray();
      res.send(result);
    });
    //  get one watch
    app.get("/watches/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const watches = await watchesCollection.findOne(query);
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
          _id: "6530d97920d3e3e89a818b89",
          image: "https://cdn.wallpapersafari.com/85/64/Gjov4X.jpg",
          name: "Apple",
        },
        {
          _id: "6530d97920d3e3e89a818b88",
          image:
            "https://media2.cgtrader.com/variants/2WStVDkAdsVBMDdBy9nBSyLB/64d1262c1acde2eb3beef249c4695a8ad88c958dd79db36f763bf631017addd0/rolex%20logo%2004.png",
          name: "Rolex",
        },
        {
          _id: "6530d97920d3e3e89a818b8c",
          image:
            "https://image.shutterstock.com/image-photo/image-260nw-639811597.jpg",
          name: "Seiko",
        },
        {
          _id: "6530d97920d3e3e89a818b8b",
          image:
            "https://t3.ftcdn.net/jpg/03/53/33/12/360_F_353331268_HOOCz1xwfkC9yzTRdtwgzKbSOQUZDMWL.jpg",
          name: "Omega",
        },
        {
          _id: "6530d97920d3e3e89a818b8a",
          image:
            "https://1000logos.net/wp-content/uploads/2017/12/Casio-symbol.jpg",
          name: "Casio",
        },
        {
          _id: "6530d97920d3e3e89a818b8d",
          image: "https://i.ytimg.com/vi/jlGVyrvQpZg/maxresdefault.jpg",
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
