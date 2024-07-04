require("../models");
const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");

let userId;
let TOKEN;
let productBody;
let product;
let cart;
let cartId;
const BASE_URL = "/api/v1/cart";
const BASE_URL_USERS = "/api/v1/users/login";

beforeAll(async () => {
  const body = {
    email: "alejandro@gmail.com",
    password: "alejandro1234",
  };

  const res = await request(app).post(BASE_URL_USERS).send(body);
  userId = res.body.user.id;
  TOKEN = res.body.token;

  productBody = {
    title: "Xiaomi 12",
    description: "Smartphone Xiaomi 12",
    price: 300,
  };

  product = await Product.create(productBody);

  cart = {
    quantity: 3,
    productId: product.id,
  };
});

test("Post -> '/cart', should return satus code 201 and res.body.quantity === cart.quantity", async () => {
  const res = await request(app).post(BASE_URL).send(cart).set("Authorization", `Bearer ${TOKEN}`);
  cartId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.quantity).toBe(cart.quantity);
});

test("Get -> '/cart', should return status code 200, res.body to have length = 1 and res.body[0] === cart", async () => {
  const res = await request(app).get(BASE_URL).set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
  expect(res.body[0]).toBeDefined();
  expect(res.body[0].quantity).toBe(cart.quantity);
  expect(res.body[0].productId).toBe(cart.productId);
});

test("Get -> '/cart/:id', should return status code 200 and res.body === cart with cartId", async () => {
  const res = await request(app).get(`${BASE_URL}/${cartId}`).set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.userId).toBeDefined();
  expect(res.body.product).toBeDefined();
  expect(res.body.userId).toBe(userId);
  expect(res.body.quantity).toBe(cart.quantity);
  expect(res.body.productId && res.body.product.id).toBe(cart.productId);
});

test("Put -> '/cart/:id', should return status code 200 and res.body === cartUpdate", async () => {
  const cartUpdate = {
    quantity: 5,
  };

  const res = await request(app).put(`${BASE_URL}/${cartId}`).send(cartUpdate).set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.quantity).toBe(cartUpdate.quantity);
});

test("Delete -> '/cart/:id', should return status code 204", async () => {
  const res = await request(app).delete(`${BASE_URL}/${cartId}`).set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
  await product.destroy();
});
