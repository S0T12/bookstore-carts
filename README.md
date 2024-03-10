### Cart Microservice

This project is a microservice application built with NestJS that provides message pattern endpoints for managing carts. It utilizes MongoDB for data storage and RabbitMQ for message queuing. Additionally, it interacts with other microservices for book and user management.

## How to Run

### Local Development

1. Clone this repository to your local machine.
2. Install dependencies using npm:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run start:dev
   ```

## Endpoints

### Cart Management

- **getCartByUserId**: Get the cart of a user by user ID.
- **getCartById**: Get a cart by its ID.
- **addToCart**: Add items to the cart.
- **removeFromCart**: Remove items from the cart.
- **clearCart**: Clear the cart.
- **updateCart**: Update the items in the cart.

## Integration with Other Microservices

The Cart Microservice interacts with the following microservices:

- **Book Microservice**: Retrieves book information based on book ID.
- **User Microservice**: Retrieves user information based on user ID.

## Functionality

### Retrieving Cart Information

- Use the `getCartByUserId` endpoint to retrieve the cart of a user by user ID.
- Use the `getCartById` endpoint to retrieve a cart by its ID.

### Adding and Removing Items

- Use the `addToCart` endpoint to add items to the cart. Provide the user ID, book ID, and quantity to add.
- Use the `removeFromCart` endpoint to remove items from the cart. Provide the user ID and book ID to remove.

### Clearing the Cart

Use the `clearCart` endpoint to remove all items from the cart. Provide the user ID whose cart needs to be cleared.

### Updating the Cart

Use the `updateCart` endpoint to update the items in the cart. Provide the user ID and the updated list of items.
