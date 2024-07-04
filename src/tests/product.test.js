require("../models");
const request = require("supertest");
const app = require("../app");
const Category = require("../models/Category");

let productId;
let TOKEN;
let category;
let product;
const BASE_URL = "/api/v1/products";
const BASE_URL_USERS = "/api/v1/users/login";

beforeAll(async () => {
  const body = {
    email: "alejandro@gmail.com",
    password: "alejandro1234",
  };

  const res = await request(app).post(BASE_URL_USERS).send(body);
  TOKEN = res.body.token;

  const categoryBody = {
    name: "celulares",
  };

  category = await Category.create(categoryBody);

  product = {
    title: "Xiaomi 12",
    description: "Smartphone Xiaomi 12",
    price: 300,
    categoryId: category.id,
  };
});

test("Post -> '/products', should return status code 201 and res.body.title === product.title", async () => {
  const res = await request(app)
    .post(BASE_URL)
    .send(product)
    .set("Authorization", `Bearer ${TOKEN}`);

  productId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(product.title);
});

test("Get -> '/products', should return status code 200 and res.body to have length = 1", async () => {
  const res = await request(app).get(BASE_URL);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.length).toBe(1);
});

test("Get -> '/products/:id', should return status code 200 and res.body = product", async () => {
  const res = await request(app)
    .get(`${BASE_URL}/${productId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(product.title);
  expect(res.body.description).toBe(product.description);
  expect(res.body.price).toBe(product.price);
});

test("Put -> '/products/:id', should return status code 200 and res.body = productUpdate", async () => {
  const productUpdate = {
    title: "Samsung galaxy S24",
    description: "Smartphe Samsung galaxy S24",
    price: 800,
  };
  const res = await request(app)
    .put(`${BASE_URL}/${productId}`)
    .send(productUpdate)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(productUpdate.title);
  expect(res.body.description).toBe(productUpdate.description);
  expect(res.body.price).toBe(productUpdate.price);
});

test("Delete -> '/products/:id', should return status code 204", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${productId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
  await category.destroy();
});
