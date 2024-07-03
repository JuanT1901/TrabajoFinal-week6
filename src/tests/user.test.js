const request = require("supertest");
const app = require("../app");

const BASE_URL = "/api/v1/users";

const user = {
  firstName: "Juan",
  lastName: "Torres",
  email: "juan@gmail.com",
  password: "juan1234",
  phone: "3042490847"
}

test("Post -> '/users', should return status code 201 and res.body === user", async() => {
  const res = await request(app).post(BASE_URL).send(user);

  expect(res.status).toBe(201);
});