import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});


app.post("/update-prices", async (req, res) => {
  try {
    const products = await fetchProducts();
    console.log(products);

    res.json({ message: "Shopify connected successfully" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Shopify connection failed" });
  }
});



const SHOPIFY_URL = `https://${process.env.SHOPIFY_STORE}/admin/api/2023-10/graphql.json`;

async function fetchProducts() {
  const query = `
  {
    products(first: 10) {
      edges {
        node {
          id
          title
        }
      }
    }
  }`;

  const response = await axios.post(
    SHOPIFY_URL,
    { query },
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}