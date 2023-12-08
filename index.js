const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
const uri = process.env.DATABASE_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const complainCollection = client.db("whichBook").collection("complain");

    // add a complain
    app.post("/add-complain", async (req, res) => {
      const data = req.body;
      const result = await complainCollection.insertOne(data);
      res.status(200).json({
        success: true,
        message: "Complain Add Successfully",
        data: result,
      });
    });

    // get all complains datas
    app.get("/complains", async (req, res) => {
      const result = await complainCollection.find({}).toArray();
      res.status(200).json({
        success: true,
        message: "All Complain Data Retrived Successfully!",
        data: result,
      });
    });

    // get single complain data
    app.get("/complains/:id", async (req, res) => {
      const { id } = req.params;
      const result = await complainCollection.findOne({
        _id: new ObjectId(id),
      });
      res.status(200).json({
        success: true,
        message: "Complain Data Retrived Successfully!",
        data: result,
      });
    });

    // delete complain data
    app.delete("/complains/:id", async (req, res) => {
      const { id } = req.params;
      const filter = { _id: ObjectId(id) };
      const result = await complainCollection.deleteOne(filter);
      res.status(200).json({
        success: true,
        message: "Complain Data Deleted Successfully!",
        data: result,
      });
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", async (req, res) => {
  res.status(200).json({
    status: 200,
    success: true,
    message: "Welcome to Dhaka Traffic Watch By Citizen Server",
  });
});

app.listen(port, () =>
  console.log(`Dhaka Traffic server is running on ${port}`)
);
