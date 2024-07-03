const request = require("supertest");
const app = require("../app");

let userId;
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
  userId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.firstName).toBe(user.firstName);
});

test("Get -> '/users', should return status code 200 and res.body === user, except res.body.password", async () => {
  const res = await request(app).get(BASE_URL).set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(2);
});

test("Post -> '/users/login', should return status code 401", async() => {
  const body = {
    email: "juan@gmail.com",
    password: "invalid password"
  };
  
  const res = await request(app).post(`${BASE_URL}/login`).send(body);

  expect(res.status).toBe(401)
});

test("Post -> '/users/login,, should return status code 200, res.body to be defined, res.body.email === body.email and res.body.token === body.token", async() => {
  const body = {
    email: "juan@gmail.com",
    password: "juan1234"
  };

  const res = await request(app).post(`${BASE_URL}/login`).send(body);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.user.email).toBe(body.email);
  expect(res.body.user.token).toBe(body.token);
});

test("Put -> '/users/:id', should return status code 200 and res.body === userUpdate", async () => {
  const userUpdate = {
    email: "alejandro@gmail.com",
    phone: "3216549873"
  };

  const res = await request(app).put(`${BASE_URL}/${userId}`).send(userUpdate).set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.phone).toBe(userUpdate.phone);
});

test("Delete -> '/users/:id, should return status code 204", async() => {
  const res = await request(app).delete(`${BASE_URL}/${userId}`).set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
});