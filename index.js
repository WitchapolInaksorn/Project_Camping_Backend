import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import memberRoute from "./routes/memberRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

//use cors before routes
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/tent", express.static("img_pd/tent"));
app.use("/table_chair", express.static("img_pd/table_chair"));
app.use("/sleeping_bag", express.static("img_pd/sleeping_bag"));
app.use("/eqt_camping", express.static("img_pd/eqt_camping"));
app.use("/backpack", express.static("img_pd/backpack"));

app.use("/img_mem", express.static("img_mem"));

app.use(bodyParser.json());

app.use(memberRoute);
app.use(productRoute);
app.use(cartRoute);

app.listen(port, () => {
  console.log(`Server is Running on port : ${port}`);
});

