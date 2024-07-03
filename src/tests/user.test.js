const request = require("supertest");
const app = require("../app");

const BASE_URL = "/api/v1/users";
let TOKEN;

beforeAll(async () => {
  const body = {
    email: "alejandro@gmail.com",
    password: "alejandro1234",
  };

  const res = await request(app).post(`${BASE_URL}/login`).send(body);
  TOKEN = res.body.token;
});

test("Post -> '/users', should return status code 201 and res.body.firstName === user.firstName", async () => {
  const user = {
    firstName: "Juan",
    lastName: "Torres",
    email: "juan@gmail.com",
    password: "juan1234",
    phone: "3042490847",
  };
  const res = await request(app).post(BASE_URL).send(user);

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.firstName).toBe(user.firstName);
});

test("Get -> 'users', should return status code 200 and res.body === user, except res.body.password", async () => {
  const res = await request(app).get(BASE_URL).set('Authorization', `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(2);
});
