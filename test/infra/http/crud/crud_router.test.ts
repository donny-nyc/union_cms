import request from 'supertest';

describe("PUT /crud", () => {
  it("Not found, if no ID is given", async () => {
    const res = await request("localhost:9999").put("/crud/");

    expect(res.statusCode).toBe(404);
  });

  it("OK, if ID is given", async () => {
    const updated_product = {
      name: "update",
      price: 1000,
      keywords: ['key1', 'key2', 'key3'],
    };

    const id = "id";
    const res = await request("localhost:9999").put(`/crud/${id}`).send(updated_product);

    expect(res.statusCode).toBe(200);
  });

  it("Bad Request, if price is negative", async () => {
    const updated_product = {
      name: "update",
      price: -1,
      keywords: ['key1', 'key2', 'key3'],
    };

    const id = "id";
    const res = await request("localhost:9999").put(`/crud/${id}`).send(updated_product);

    expect(res.statusCode).toBe(400);
  });

  it("Bad Request, if name is missing", async () => {
    const updated_product = {
      name: "",
    };

    const id = "id";
    const res = await request("localhost:9999").put(`/crud/${id}`).send(updated_product);

    expect(res.statusCode).toBe(400);
  });

  it("Bad Request, if keywords is empty", async () => {
    const updated_product = {
      keywords: []
    };

    const id = "id";
    const res = await request("localhost:9999").put(`/crud/${id}`).send(updated_product);

    expect(res.statusCode).toBe(400);
  });
});
