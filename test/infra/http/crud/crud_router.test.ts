import request from 'supertest';

describe("PUT /crud", () => {
  beforeAll(async () => {
    const record = {
      name: 'original',
      price: 0,
      keywords: [],
    };

    const res = await request("localhost:9999").post("/crud/").send(record);
  });

  it("Not found, if no ID is given", async () => {
    const res = await request("localhost:9999").put("/crud/");

    expect(res.statusCode).toBe(404);
  });

  it("Not found, if ID is not recognized", async () => {
    const randomId = Math.floor(Math.random() * 1000) + 1000;
    const res = await request("localhost:9999").put(`/crud/${randomId}`);

    expect(res.statusCode).toBe(404);
  }, 30000);

  it.only("OK, if ID is given", async () => {
    const record = {
      id: 0,
      name: 'original',
      price: 0,
      keywords: [],
    };

    const insert = await request("localhost:9999").post("/crud").send(record);

    console.log('insert', insert);

    const updated_product = {
      name: "update",
      price: 1000,
      keywords: ['key1', 'key2', 'key3'],
    };

    const res = await request("localhost:9999").put(`/crud/${record.id}`).send(updated_product);

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

describe("POST /crud", () => {
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
