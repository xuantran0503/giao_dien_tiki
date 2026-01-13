# Cart API Debugging Guide

## Current Issues

- Status: 400 Bad Request / Method Not Allowed
- Endpoints affected: All cart operations

## API Endpoints Analysis

### Based on Swagger Documentation:

1. **Add Item**: `POST /api-end-user/cart/cart-public/item`
2. **Remove Item**: `POST /api-end-user/cart/cart-public/remove-item`
3. **Update Item**: `POST /api-end-user/cart/cart-public/update-item`
4. **Clear Cart**: `POST /api-end-user/cart/cart-public/clear-item`
5. **Get Cart**: `GET /api-end-user/cart/cart-public/{cartId}`

## Payload Structure (Expected by Backend)

### Add Item Payload:

```json
{
  "CartId": "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75",
  "ItemId": "product-id-string",
  "Count": 1,
  "UsingDate": ["2026-01-07T10:00:00.000Z"],
  "AId": "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75"
}
```

### Query Parameters:

- All POST requests should include: `?aid={A_ID}`

## Troubleshooting Steps

1. **Verify CartId**: Must be a valid GUID
2. **Verify ItemId**: Must match product ID format from backend
3. **Verify HTTP Method**: Ensure using POST for mutations
4. **Verify Headers**: Check if Content-Type is application/json
5. **Verify UsingDate**: Must be ISO string array

## Next Steps

- Check actual Swagger response for exact field requirements
- Verify if backend expects different field casing
- Check if aid parameter should be in body instead of query string
