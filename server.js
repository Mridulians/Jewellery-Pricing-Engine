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

    for (const productEdge of products.data.products.edges) {
      const product = productEdge.node;

      for (const variantEdge of product.variants.edges) {
        const variant = variantEdge.node;

        const goldRate = Number(req.body.goldRate);

        const newPrice = (parseFloat(variant.price) + goldRate * 5).toFixed(2);

        await updateVariantPrice(product.id , variant.id, newPrice);

        console.log("Updated:", variant.id);
        console.log("Current Price:", variant.price);
        console.log("New Price:", newPrice);
        //  break;

        // console.log("Variant ID:", variant.id);
        // console.log("Current Price:", variant.price);
      }
    }
    // console.log(products);
    // console.log(JSON.stringify(products, null, 2));
    console.log("no of products", products.data.products.edges.length);

    res.json({ message: "Shopify connected successfully" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Shopify connection failed" });
  }
});

// const SHOPIFY_URL = `https://${process.env.SHOPIFY_STORE}/admin/api/2023-10/graphql.json`;
const SHOPIFY_URL = `https://${process.env.SHOPIFY_STORE}/admin/api/2024-04/graphql.json`;

async function fetchProducts() {
  const query = `
{
  products(first: 20) {
    edges {
      node {
        id
        title
        variants(first: 20) {
          edges {
            node {
              id
              price
            }
          }
        }
      }
    }
  }
}
`;

  const response = await axios.post(
    SHOPIFY_URL,
    { query },
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
}

// async function updateVariantPrice(variantId, price) {
//   const mutation = `
// mutation productVariantUpdate($input: ProductVariantInput!) {
//   productVariantUpdate(input: $input) {
//     productVariant {
//       id
//       price
//     }
//   }
// }
// `;

//   const variables = {
//     input: {
//       id: variantId,
//       price: price.toString(),
//     },
//   };

//   await axios.post(
//     SHOPIFY_URL,
//     { query: mutation, variables },
//     {
//       headers: {
//         "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
//         "Content-Type": "application/json",
//       },
//     },
//   );
// }












// async function updateVariantPrice(variantId, price) {

//   const mutation = `
//   mutation productVariantUpdate($input: ProductVariantInput!) {
//     productVariantUpdate(input: $input) {
//       productVariant {
//         id
//         price
//       }
//       userErrors {
//         field
//         message
//       }
//     }
//   }
//   `;

//   const variables = {
//     input: {
//       id: variantId,
//       price: price.toString()
//     }
//   };

//   const response = await axios.post(
//     SHOPIFY_URL,
//     { query: mutation, variables },
//     {
//       headers: {
//         "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   const data = response.data.data.productVariantUpdate;

//   if (data.userErrors.length > 0) {
//     console.log("SHOPIFY ERROR:", data.userErrors);
//   } else {
//     console.log("SUCCESS:", data.productVariant.price);
//   }
// }



// async function updateVariantPrice(variantId, price) {

//   const mutation = `
//   mutation productVariantUpdate($input: ProductVariantInput!) {
//     productVariantUpdate(input: $input) {
//       productVariant {
//         id
//         price
//       }
//       userErrors {
//         field
//         message
//       }
//     }
//   }
//   `;

//   const variables = {
//     input: {
//       id: variantId,
//       price: price.toString()
//     }
//   };

//   const response = await axios.post(
//     SHOPIFY_URL,
//     { query: mutation, variables },
//     {
//       headers: {
//         "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   console.log("SHOPIFY RESPONSE:");
//   console.log(JSON.stringify(response.data, null, 2));
// }



// async function updateVariantPrice(variantId, price) {

//   const mutation = `
//   mutation productVariantsBulkUpdate($variants: [ProductVariantsBulkInput!]!) {
//     productVariantsBulkUpdate(variants: $variants) {
//       productVariants {
//         id
//         price
//       }
//       userErrors {
//         field
//         message
//       }
//     }
//   }
//   `;

//   const variables = {
//     variants: [
//       {
//         id: variantId,
//         price: price.toString()
//       }
//     ]
//   };

//   const response = await axios.post(
//     SHOPIFY_URL,
//     { query: mutation, variables },
//     {
//       headers: {
//         "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   console.log(JSON.stringify(response.data, null, 2));
// }



async function updateVariantPrice(productId, variantId, price) {

  const mutation = `
  mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants {
        id
        price
      }
      userErrors {
        field
        message
      }
    }
  }
  `;

  const variables = {
    productId: productId,
    variants: [
      {
        id: variantId,
        price: price.toString()
      }
    ]
  };

  const response = await axios.post(
    SHOPIFY_URL,
    { query: mutation, variables },
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json"
      }
    }
  );

  console.log(JSON.stringify(response.data, null, 2));
}