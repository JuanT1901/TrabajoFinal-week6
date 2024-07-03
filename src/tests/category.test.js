const request = require("supertest");
const app = require("../app");

let categoryId;
let TOKEN;
const BASE_URL = "/api/v1/categories";
const BASE_URL_USERS = "/api/v1/users";

beforeAll(async () => {
  const body = {
    email: "alejandro@gmail.com",
    password: "alejandro1234",
  };

  const res = await request(app).post(`${BASE_URL_USERS}/login`).send(body);
  TOKEN = res.body.token;
});

test("Post -> '/categories', should return status code 201 and res.body.name === category.name", async () => {
  const category = {
    name: "Tecnologia",
  };
  const res = await request(app)
    .post(BASE_URL)
    .send(category)
    .set("Authorization", `Bearer ${TOKEN}`);
  categoryId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.name).toBe(category.name);
});

test("Get -> '/categories', should return status code 200 and res.body to have length = 1", async () => {
  const res = await request(app).get(BASE_URL);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
});

test("Delete -> '/categories/:id', should return status code 204", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${categoryId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
});
