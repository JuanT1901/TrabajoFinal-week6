require("../models");
const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");

let userId;
let TOKEN;
let productBody;
let product;
let cart;
const BASE_URL = "/api/v1/purchase";
const BASE_URL_USERS = "/api/v1/users/login";
const BASE_URL_CART = "/api/v1/cart";

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

  await request(app).post(BASE_URL_CART).send(cart).set("Authorization", `Bearer ${TOKEN}`);
});

afterAll(async() => {
  await product.destroy();
});

test("Post -> '/purchase, should return status code 201 and res.body[0] === cart", async() => {
  const res = await request(app).post(BASE_URL).set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body[0].quantity).toBe(cart.quantity);
  expect(res.body[0].productId).toBe(cart.productId);
});

test("Get -> '/purchase', should return status code 200, res.body to have length = 1, res.body[0].product === product exluding description and res.body[0].userId === userId", async() => {
  const res = await request(app).get(BASE_URL).set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
  expect(res.body[0].id).toBe(product.id);
  expect(res.body[0].product.title).toBe(product.title);
  expect(res.body[0].product.price).toBe(product.price);
  expect(res.body[0].userId).toBe(userId);
})
