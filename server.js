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




//WORKING CODE FOR THE PRICE CALCULATION AND UPDATE WITHOUT USING TAGS
// import dotenv from "dotenv";

// import express from "express";
// import axios from "axios";
// import cors from "cors";

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.static("public"));

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// const SHOPIFY_URL = `https://${process.env.SHOPIFY_STORE}/admin/api/2024-04/graphql.json`;

// app.post("/update-prices", async (req, res) => {
//   try {
//     const goldRate = Number(req.body.goldRate || 0);
//     const silverRate = Number(req.body.silverRate || 0);
//     const diamondRate = Number(req.body.diamondRate || 0);

//     console.log("goldrate",goldRate , "silverrate", silverRate , "diamondrate" , diamondRate);

//     // const products = await fetchProducts();
//     const response = await fetchProducts();

//     console.log(response)

//     if (!response.data || !response.data.products) {
//       throw new Error("Invalid Shopify response");
//     }

//     const products = response.data.products.edges;

//     // console.log(products)

//     for (const productEdge of products) {
//       const product = productEdge.node;

//       const metafieldsMap = {};

//       product.metafields.edges.forEach((edge) => {
//         const m = edge.node;
//         metafieldsMap[m.key] = Number(m.value || 0);
//       });

//       const goldWeight = metafieldsMap.gold_weight || 0;
//       const silverWeight = metafieldsMap.silver_weight || 0;
//       const diamondCarat = metafieldsMap.diamond_carat || 0;
//       // const makingCharge = metafieldsMap.making_charge || 0;

//       const goldValue = goldWeight * goldRate;
//       const silverValue = silverWeight * silverRate;
//       const diamondValue = diamondCarat * diamondRate;

//       const subtotal = goldValue + silverValue + diamondValue;

//       const makingCharge = subtotal * 0.15;  // Assuming making charge is 15% of the subtotal

//       const total = subtotal + makingCharge;

//       const gst = total * 0.03;

//       const finalPrice = (total + gst).toFixed(2);

//       console.log("final Price" , finalPrice);

//       const variants = product.variants.edges.map((v) => ({
//         id: v.node.id,
//         price: finalPrice,
//       }));

//       await updateVariantPrice(product.id, variants);

//       console.log(`Updated product: ${product.title}`);
//     }

//     // console.log("Products processed:", products.data.products.edges.length);
//     console.log("Products processed:", products.length);

//     res.json({ message: "Prices updated successfully" });
//   } catch (err) {
//     // console.error(err.response?.data || err.message);
//     console.error(err || err.message);

//     res.status(500).json({
//       message: "Price update failed",
//     });
//   }
// });

// async function fetchProducts() {

//   const query = `
// {
//   products(first: 50) {
//     edges {
//       node {
//         id
//         title
//         tags

//         metafields(first: 50, namespace: "custom") {
//           edges {
//             node {
//               key
//               value
//             }
//           }
//         }

//         variants(first: 50) {
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

//   // console.log(JSON.stringify(response.data, null, 2));

//   return response.data;
// }

// async function updateVariantPrice(productId, variants) {
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
//     productId,
//     variants,
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

//   if (response.data.data.productVariantsBulkUpdate.userErrors.length) {
//     console.error(response.data.data.productVariantsBulkUpdate.userErrors);
//   }
// }











// New code for saving breakdown in metafields along with price update



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

// app.post("/update-prices", async (req, res) => {
//   try {
//     const goldRate = Number(req.body.goldRate || 0);
//     const silverRate = Number(req.body.silverRate || 0);
//     const diamondRate = Number(req.body.diamondRate || 0);

//     console.log(
//       "goldrate",
//       goldRate,
//       "silverrate",
//       silverRate,
//       "diamondrate",
//       diamondRate,
//     );

//     // const products = await fetchProducts();
//     const response = await fetchProducts();

//     console.log(response);

//     if (!response.data || !response.data.products) {
//       throw new Error("Invalid Shopify response");
//     }

//     const products = response.data.products.edges;

//     // console.log(products)

//     // for (const productEdge of products) {
//     //   const product = productEdge.node;

//     //   const metafieldsMap = {};

//     //   product.metafields.edges.forEach((edge) => {
//     //     const m = edge.node;
//     //     metafieldsMap[m.key] = Number(m.value || 0);
//     //   });

//     //   const goldWeight = metafieldsMap.gold_weight || 0;
//     //   const silverWeight = metafieldsMap.silver_weight || 0;
//     //   const diamondCarat = metafieldsMap.diamond_carat || 0;
//     //   // const makingCharge = metafieldsMap.making_charge || 0;

//     //   const goldValue = goldWeight * goldRate;
//     //   const silverValue = silverWeight * silverRate;
//     //   const diamondValue = diamondCarat * diamondRate;

//     //   const subtotal = goldValue + silverValue + diamondValue;

//     //   const makingCharge = subtotal * 0.15;  // Assuming making charge is 15% of the subtotal

//     //   const total = subtotal + makingCharge;

//     //   const gst = total * 0.03;

//     //   const finalPrice = (total + gst).toFixed(2);

//     //   console.log("final Price" , finalPrice);

//     //   const variants = product.variants.edges.map((v) => ({
//     //     id: v.node.id,
//     //     price: finalPrice,
//     //   }));

//     //   await updateVariantPrice(product.id, variants);

//     //   console.log(`Updated product: ${product.title}`);
//     // }



//     for (const productEdge of products) {
//       const product = productEdge.node;

//       const metafieldsMap = {};
//       product.metafields.edges.forEach((edge) => {
//         const m = edge.node;
//         metafieldsMap[m.key] = Number(m.value || 0);
//       });

//       const goldWeight = metafieldsMap.gold_weight || 0;
//       const silverWeight = metafieldsMap.silver_weight || 0;
//       const diamondCarat = metafieldsMap.diamond_carat || 0;

//       const goldValue = goldWeight * goldRate;
//       const silverValue = silverWeight * silverRate;
//       const diamondValue = diamondCarat * diamondRate;

//       const subtotal = goldValue + silverValue + diamondValue;
//       const makingCharge = subtotal * 0.15;
//       const total = subtotal + makingCharge;
//       const gst = total * 0.03;
//       const finalPrice = (total + gst).toFixed(2);

//       const variants = product.variants.edges.map((v) => ({
//         id: v.node.id,
//         price: finalPrice,
//       }));

//       await updateVariantPrice(product.id, variants);

//       // ✅ NEW: Save breakdown into metafields
//       await saveBreakdownMetafields(product.id, {
//         gold_value: goldValue.toFixed(2),
//         silver_value: silverValue.toFixed(2),
//         diamond_value: diamondValue.toFixed(2),
//         making_charge: makingCharge.toFixed(2),
//         subtotal: subtotal.toFixed(2),
//         gst: gst.toFixed(2),
//         final_price: finalPrice,
//         gold_rate: goldRate.toFixed(2),
//         silver_rate: silverRate.toFixed(2),
//         diamond_rate: diamondRate.toFixed(2),
//       });

//       console.log(`Updated product: ${product.title}`);
//     }

//     // console.log("Products processed:", products.data.products.edges.length);
//     console.log("Products processed:", products.length);

//     res.json({ message: "Prices updated successfully" });
//   } catch (err) {
//     // console.error(err.response?.data || err.message);
//     console.error(err || err.message);

//     res.status(500).json({
//       message: "Price update failed",
//     });
//   }
// });



// async function fetchProducts() {
//   const query = `
// {
//   products(first: 50) {
//     edges {
//       node {
//         id
//         title
//         tags

//         metafields(first: 50, namespace: "custom") {
//           edges {
//             node {
//               key
//               value
//             }
//           }
//         }

//         variants(first: 50) {
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

//   // console.log(JSON.stringify(response.data, null, 2));

//   return response.data;
// }




app.post("/update-prices", async (req, res) => {
  const goldRate = Number(req.body.goldRate || 0);
  const silverRate = Number(req.body.silverRate || 0);
  const diamondRate = Number(req.body.diamondRate || 0);

  // ✅ Respond immediately — don't make user wait
  res.json({ message: "Price update started! Check progress below." });

  // ✅ Run update in background
  runPriceUpdate(goldRate, silverRate, diamondRate);
});

// Track progress globally
let updateProgress = { 
  running: false, 
  total: 0, 
  done: 0, 
  status: "idle",
  message: ""
};

async function runPriceUpdate(goldRate, silverRate, diamondRate) {
  updateProgress = { running: true, total: 0, done: 0, status: "running", message: "Fetching products..." };

  try {
    const products = await fetchAllProducts();
    updateProgress.total = products.length;
    updateProgress.message = `Updating ${products.length} products...`;

    await processBatch(products, 5, async (productEdge) => {
      const product = productEdge.node;

      const metafieldsMap = {};
      product.metafields.edges.forEach((edge) => {
        const m = edge.node;
        metafieldsMap[m.key] = Number(m.value || 0);
      });

      const goldWeight = metafieldsMap.gold_weight || 0;
      const silverWeight = metafieldsMap.silver_weight || 0;
      const diamondCarat = metafieldsMap.diamond_carat || 0;

      const goldValue = goldWeight * goldRate;
      const silverValue = silverWeight * silverRate;
      const diamondValue = diamondCarat * diamondRate;

      const subtotal = goldValue + silverValue + diamondValue;
      const makingCharge = subtotal * 0.15;
      const total = subtotal + makingCharge;
      const gst = total * 0.03;
      const finalPrice = (total + gst).toFixed(2);

      const variants = product.variants.edges.map((v) => ({
        id: v.node.id,
        price: finalPrice,
      }));

      await updateVariantPrice(product.id, variants);
      await saveBreakdownMetafields(product.id, {
        gold_value: goldValue.toFixed(2),
        silver_value: silverValue.toFixed(2),
        diamond_value: diamondValue.toFixed(2),
        making_charge: makingCharge.toFixed(2),
        subtotal: (subtotal + makingCharge).toFixed(2),
        gst: gst.toFixed(2),
        final_price: finalPrice,
        gold_rate: goldRate.toFixed(2),
        silver_rate: silverRate.toFixed(2),
        diamond_rate: diamondRate.toFixed(2),
      });

      // ✅ Update progress
      updateProgress.done++;
      console.log(`✅ ${updateProgress.done}/${updateProgress.total} - ${product.title}`);
    });

    updateProgress = { running: false, total: updateProgress.total, done: updateProgress.total, status: "done", message: `✅ All ${updateProgress.total} products updated!` };

  } catch (err) {
    updateProgress = { running: false, total: 0, done: 0, status: "error", message: "❌ Update failed: " + err.message };
    console.error(err.message);
  }
}

// ✅ Progress endpoint — frontend polls this
app.get("/update-progress", (req, res) => {
  res.json(updateProgress);
});



async function fetchAllProducts() {
  let allProducts = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const query = `
    {
      products(first: 50${cursor ? `, after: "${cursor}"` : ""}) {
        edges {
          cursor
          node {
            id
            title
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
        pageInfo {
          hasNextPage
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
      }
    );

    const data = response.data.data.products;
    const edges = data.edges;

    allProducts = [...allProducts, ...edges];
    hasNextPage = data.pageInfo.hasNextPage;

    // Get cursor of last item for next page
    if (hasNextPage && edges.length > 0) {
      cursor = edges[edges.length - 1].cursor;
    }

    console.log(`Fetched ${allProducts.length} products so far...`);

    // Small delay between page fetches
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log(`Total products fetched: ${allProducts.length}`);
  return allProducts;
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



// ✅ NEW: Function to save breakdown into metafields
async function saveBreakdownMetafields(productId, breakdown) {
  const mutation = `
    mutation UpdateProductMetafields($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const metafields = Object.entries(breakdown).map(([key, value]) => ({
    namespace: "custom",
    key: key,
    value: String(value),
    type: "number_decimal",
  }));

  const variables = {
    input: {
      id: productId,
      metafields,
    },
  };

  const response = await axios.post(
    SHOPIFY_URL,
    { query: mutation, variables },
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.data.data.productUpdate.userErrors.length) {
    console.error("Metafield errors:", response.data.data.productUpdate.userErrors);
  }
}




// new utility function to process items in batches with delay to respect rate limits
async function processBatch(items, batchSize, handler) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.all(batch.map(handler));
    console.log(`✅ Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)} done`);
    // Delay between batches to respect Shopify rate limits
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}