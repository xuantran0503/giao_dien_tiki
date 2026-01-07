# Cart Refactoring Summary

## Changes Made to CartItem Interface

### Old Structure:

```typescript
interface CartItem {
  id: string | number;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  quantity: number;
}
```

### New Structure:

```typescript
interface CartItem {
  cartItemId: string; // Unique ID for this item in cart (from backend)
  productId: string; // Product ID for linking to product detail
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  quantity: number;
}
```

## Required Changes in CartPage.jsx

### 1. Selection Logic

- **Old**: `selectedItems.includes(item.id)`
- **New**: `selectedItems.includes(item.cartItemId)`

### 2. Product Links

- **Old**: `to={/product/${item.id}}`
- **New**: `to={/product/${item.productId}}`

### 3. Cart Operations (remove, update quantity)

- **Old**: Pass `item.id` to functions
- **New**: Pass `item.cartItemId` to cart operations
- **Keep**: Use `item.productId` for product links

### 4. Key Props

- **Old**: `key={item.id}`
- **New**: `key={item.cartItemId}`

## Functions That Need Updates

1. **handleSelectAll**: Use `cartItemId` for selection
2. **handleSelectItem**: Use `cartItemId` for selection
3. **handleIncrease**: Pass `cartItemId` and `productId`
4. **handleDecrease**: Pass `cartItemId` and `productId`
5. **handleRemove**: Pass `cartItemId`
6. **handleQuantityClick**: Use `cartItemId`
7. **handleQuantityBlur**: Pass both IDs to update
8. **calculateSubtotal/Total**: Use `cartItemId` for filtering

## Example Updates

### Before:

```jsx
<div key={item.id}>
  <Link to={`/product/${item.id}`}>{item.name}</Link>
  <button onClick={() => handleRemove(item.id)}>Remove</button>
</div>
```

### After:

```jsx
<div key={item.cartItemId}>
  <Link to={`/product/${item.productId}`}>{item.name}</Link>
  <button onClick={() => handleRemove(item.cartItemId)}>Remove</button>
</div>
```

## API Call Updates

### addItemToCart

- Needs: `productId`, `quantity`, `price`, etc.
- Returns: Success/failure

### removeItemFromCart

- Needs: `cartItemId` (not productId!)
- Returns: `{ cartItemId }`

### updateCartItemQuantity

- Needs: `cartItemId`, `productId`, `quantity`
- Returns: Success/failure

### fetchCartDetail

- Returns: Array of CartItems with both `cartItemId` and `productId`
