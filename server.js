// import dotenv from "dotenv";
// import express from "express";
// import axios from "axios";
// import cors from "cors";

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.static("public"));

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });

// app.post("/update-prices", async (req, res) => {
//   try {
//     const products = await fetchProducts();

//     for (const productEdge of products.data.products.edges) {
//       const product = productEdge.node;

//       const metafields = product.metafields;

//       const goldWeight = Number(
//         metafields.find((m) => m.key === "gold_weight")?.value || 0,
//       );

//       const silverWeight = Number(
//         metafields.find((m) => m.key === "silver_weight")?.value || 0,
//       );

//       const diamondCarat = Number(
//         metafields.find((m) => m.key === "diamond_carat")?.value || 0,
//       );

//       const makingCharge = Number(
//         metafields.find((m) => m.key === "making_charge")?.value || 0,
//       );

//       const goldRate = Number(req.body.goldRate || 0);
//       const silverRate = Number(req.body.silverRate || 0);
//       const diamondRate = Number(req.body.diamondRate || 0);

//       const tags = product.tags;

//       let rate = 0;

//       if (tags.includes("gold")) {
//         rate = goldRate;
//       } else if (tags.includes("silver")) {
//         rate = silverRate;
//       } else if (tags.includes("diamond")) {
//         rate = diamondRate;
//       }

//       const goldValue = goldWeight * goldRate;
//       const silverValue = silverWeight * silverRate;
//       const diamondValue = diamondCarat * diamondRate;

//       const subtotal = goldValue + silverValue + diamondValue + makingCharge;

//       const gst = subtotal * 0.03;

//       const finalPrice = (subtotal + gst).toFixed(2);

//       for (const variantEdge of product.variants.edges) {
//         const variant = variantEdge.node;

//         // const goldRate = Number(req.body.goldRate);

//         // const newPrice = (parseFloat(variant.price) + goldRate * 5).toFixed(2);
//         // const newPrice = (Number(variant.price) + rate * 5).toFixed(2);

//         await updateVariantPrice(product.id, variant.id, finalPrice);

//         console.log("Updated:", variant.id);
//         console.log("Tags:", tags);
//         console.log("Rate Used:", rate);
//         console.log("Current Price:", variant.price);
//         console.log("New Price:", newPrice);
//         //  break;

//         // console.log("Variant ID:", variant.id);
//         // console.log("Current Price:", variant.price);
//       }
//     }
//     // console.log(products);
//     // console.log(JSON.stringify(products, null, 2));
//     console.log("no of products", products.data.products.edges.length);

//     res.json({ message: "Shopify connected successfully" });
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.status(500).json({ message: "Shopify connection failed" });
//   }
// });

// // const SHOPIFY_URL = `https://${process.env.SHOPIFY_STORE}/admin/api/2023-10/graphql.json`;
// const SHOPIFY_URL = `https://${process.env.SHOPIFY_STORE}/admin/api/2024-04/graphql.json`;

// async function fetchProducts() {
//   const query = `
// {
//   products(first: 20) {
//     edges {
//       node {
//         id
//         title
//         tags
//         metafields(identifiers: [
//           {namespace: "custom", key: "metal_type"},
//           {namespace: "custom", key: "gold_weight"},
//           {namespace: "custom", key: "silver_weight"},
//           {namespace: "custom", key: "diamond_carat"},
//           {namespace: "custom", key: "making_charge"}
//         ]) {
//           key
//           value
//         }
//         variants(first: 20) {
//           edges {
//             node {
//               id
//               price
//             }
//           }
//         }
//       }
//     }
//   }
// }
// `;

//   const response = await axios.post(
//     SHOPIFY_URL,
//     { query },
//     {
//       headers: {
//         "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
//         "Content-Type": "application/json",
//       },
//     },
//   );

//   return response.data;
// }

// async function updateVariantPrice(productId, variantId, price) {
//   const mutation = `
//   mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
//     productVariantsBulkUpdate(productId: $productId, variants: $variants) {
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
//     productId: productId,
//     variants: [
//       {
//         id: variantId,
//         price: price.toString(),
//       },
//     ],
//   };

//   const response = await axios.post(
//     SHOPIFY_URL,
//     { query: mutation, variables },
//     {
//       headers: {
//         "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
//         "Content-Type": "application/json",
//       },
//     },
//   );

//   console.log(JSON.stringify(response.data, null, 2));
// }

import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const SHOPIFY_URL = `https://${process.env.SHOPIFY_STORE}/admin/api/2024-04/graphql.json`;

app.post("/update-prices", async (req, res) => {
  try {
    const goldRate = Number(req.body.goldRate || 0);
    const silverRate = Number(req.body.silverRate || 0);
    const diamondRate = Number(req.body.diamondRate || 0);

    console.log("goldrate",goldRate , "silverrate", silverRate , "diamondrate" , diamondRate);

    // const products = await fetchProducts();
    const response = await fetchProducts();

    console.log(response)

    if (!response.data || !response.data.products) {
      throw new Error("Invalid Shopify response");
    }

    const products = response.data.products.edges;

    // console.log(products)

    for (const productEdge of products) {
      const product = productEdge.node;

      // const metafieldsMap = {};

      // product.metafields.forEach((m) => {
      //   metafieldsMap[m.key] = Number(m.value || 0);
      // });

      const metafieldsMap = {};

      product.metafields.edges.forEach((edge) => {
        const m = edge.node;
        metafieldsMap[m.key] = Number(m.value || 0);
      });

      const goldWeight = metafieldsMap.gold_weight || 0;
      const silverWeight = metafieldsMap.silver_weight || 0;
      const diamondCarat = metafieldsMap.diamond_carat || 0;
      const makingCharge = metafieldsMap.making_charge || 0;

      const goldValue = goldWeight * goldRate;
      const silverValue = silverWeight * silverRate;
      const diamondValue = diamondCarat * diamondRate;

      const subtotal = goldValue + silverValue + diamondValue + makingCharge;

      const gst = subtotal * 0.03;

      const finalPrice = (subtotal + gst).toFixed(2);

      console.log("final Price" , finalPrice);

      const variants = product.variants.edges.map((v) => ({
        id: v.node.id,
        price: finalPrice,
      }));

      await updateVariantPrice(product.id, variants);

      console.log(`Updated product: ${product.title}`);
    }

    // console.log("Products processed:", products.data.products.edges.length);
    console.log("Products processed:", products.length);

    res.json({ message: "Prices updated successfully" });
  } catch (err) {
    // console.error(err.response?.data || err.message);
    console.error(err || err.message);

    res.status(500).json({
      message: "Price update failed",
    });
  }
});

async function fetchProducts() {
  // const query = `
  // {
  //   products(first: 20) {
  //     edges {
  //       node {
  //         id
  //         title
  //         tags
  //         metafields(identifiers: [
  //           {namespace: "custom", key: "gold_weight"},
  //           {namespace: "custom", key: "silver_weight"},
  //           {namespace: "custom", key: "diamond_carat"},
  //           {namespace: "custom", key: "making_charge"}
  //         ]) {
  //           key
  //           value
  //         }
  //         variants(first: 20) {
  //           edges {
  //             node {
  //               id
  //               price
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  // `;

  const query = `
{
  products(first: 50) {
    edges {
      node {
        id
        title
        tags

        metafields(first: 50, namespace: "custom") {
          edges {
            node {
              key
              value
            }
          }
        }

        variants(first: 50) {
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

  // console.log(JSON.stringify(response.data, null, 2));

  return response.data;
}

async function updateVariantPrice(productId, variants) {
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
    productId,
    variants,
  };

  const response = await axios.post(
    SHOPIFY_URL,
    { query: mutation, variables },
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    },
  );

  if (response.data.data.productVariantsBulkUpdate.userErrors.length) {
    console.error(response.data.data.productVariantsBulkUpdate.userErrors);
  }
}
