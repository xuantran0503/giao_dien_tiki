/**
 * Test Data for Cart API - Add Item Endpoint
 * Endpoint: POST /api-end-user/cart/cart-public/item
 *
 * Try these payloads one by one to see which one works
 */

const API_BASE = "http://192.168.2.112:9092";
const A_ID = "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75";
const CART_ID = "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75";
const PRODUCT_ID = "afa45f79-9620-4249-a1f7-92cd4411608c";

// ============================================
// OPTION 1: Minimal Payload (Current)
// ============================================
const payload1 = {
  CartId: CART_ID,
  ItemId: PRODUCT_ID,
  Count: 1,
  AId: A_ID,
};

// ============================================
// OPTION 2: With UsingDate (ISO String)
// ============================================
const payload2 = {
  CartId: CART_ID,
  ItemId: PRODUCT_ID,
  Count: 1,
  UsingDate: [new Date().toISOString()],
  AId: A_ID,
};

// ============================================
// OPTION 3: With UsingDate (Date only YYYY-MM-DD)
// ============================================
const payload3 = {
  CartId: CART_ID,
  ItemId: PRODUCT_ID,
  Count: 1,
  UsingDate: [new Date().toISOString().split("T")[0]],
  AId: A_ID,
};

// ============================================
// OPTION 4: With Price Information
// ============================================
const payload4 = {
  CartId: CART_ID,
  ItemId: PRODUCT_ID,
  Count: 1,
  Price: 120000,
  AId: A_ID,
};

// ============================================
// OPTION 5: With Full Product Details
// ============================================
const payload5 = {
  CartId: CART_ID,
  ItemId: PRODUCT_ID,
  Count: 1,
  Price: 120000,
  ProductName: "Vé khu vui chơi 0001",
  UsingDate: [new Date().toISOString()],
  AId: A_ID,
};

// ============================================
// OPTION 6: Different Field Names (camelCase)
// ============================================
const payload6 = {
  cartId: CART_ID,
  itemId: PRODUCT_ID,
  count: 1,
  aId: A_ID,
};

// ============================================
// OPTION 7: With ListingId (if product needs listing reference)
// ============================================
const payload7 = {
  CartId: CART_ID,
  ItemId: PRODUCT_ID,
  ListingId: PRODUCT_ID, // Sometimes ItemId and ListingId are different
  Count: 1,
  AId: A_ID,
};

// ============================================
// OPTION 8: Nested Structure
// ============================================
const payload8 = {
  CartId: CART_ID,
  Item: {
    Id: PRODUCT_ID,
    Quantity: 1,
  },
  AId: A_ID,
};

// ============================================
// OPTION 9: Array of Items
// ============================================
const payload9 = {
  CartId: CART_ID,
  Items: [
    {
      ItemId: PRODUCT_ID,
      Count: 1,
    },
  ],
  AId: A_ID,
};

// ============================================
// OPTION 10: With Empty UsingDate Array
// ============================================
const payload10 = {
  CartId: CART_ID,
  ItemId: PRODUCT_ID,
  Count: 1,
  UsingDate: [],
  AId: A_ID,
};

// ============================================
// HOW TO TEST IN BROWSER CONSOLE
// ============================================
/*
// Copy this code to browser console and run:

async function testAddToCart(payload, optionNumber) {
  try {
    console.log(`\n=== TESTING OPTION ${optionNumber} ===`);
    console.log("Payload:", JSON.stringify(payload, null, 2));
    
    const response = await fetch(
      'http://192.168.2.112:9092/api-end-user/cart/cart-public/item?aid=da1e0cd8-f73b-4da2-acf2-8ddc621bcf75',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    );
    
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", data);
    
    if (response.ok) {
      console.log("✅ SUCCESS!");
      return data;
    } else {
      console.log("❌ FAILED");
      return null;
    }
  } catch (error) {
    console.error("❌ ERROR:", error);
    return null;
  }
}

// Test each option
testAddToCart(payload1, 1);
// If failed, try next:
// testAddToCart(payload2, 2);
// testAddToCart(payload3, 3);
// ... and so on
*/

// ============================================
// CURL COMMANDS FOR TESTING
// ============================================
/*
# Option 1: Minimal
curl -X POST "http://192.168.2.112:9092/api-end-user/cart/cart-public/item?aid=da1e0cd8-f73b-4da2-acf2-8ddc621bcf75" \
  -H "Content-Type: application/json" \
  -d '{"CartId":"da1e0cd8-f73b-4da2-acf2-8ddc621bcf75","ItemId":"afa45f79-9620-4249-a1f7-92cd4411608c","Count":1,"AId":"da1e0cd8-f73b-4da2-acf2-8ddc621bcf75"}'

# Option 2: With UsingDate
curl -X POST "http://192.168.2.112:9092/api-end-user/cart/cart-public/item?aid=da1e0cd8-f73b-4da2-acf2-8ddc621bcf75" \
  -H "Content-Type: application/json" \
  -d '{"CartId":"da1e0cd8-f73b-4da2-acf2-8ddc621bcf75","ItemId":"afa45f79-9620-4249-a1f7-92cd4411608c","Count":1,"UsingDate":["2026-01-07T10:00:00.000Z"],"AId":"da1e0cd8-f73b-4da2-acf2-8ddc621bcf75"}'
*/

export {
  payload1,
  payload2,
  payload3,
  payload4,
  payload5,
  payload6,
  payload7,
  payload8,
  payload9,
  payload10,
};
