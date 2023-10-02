import request from 'supertest';

describe("GET /crud/:id", () => {
  it("can return an existing record", async () => {
    const record = {
      id: 0,
      name: 'original',
      price: 0,
      keywords: ['original'],
    };

    const insert = await request("localhost:9999").post("/crud").send(record);

    const id = insert.body.id;

    const getResult = await request("localhost:9999").get(`/crud/${id}`);

    expect(getResult.statusCode).toBe(200);
    expect(getResult.body.id).toEqual(id);
    expect(getResult.body.name).toEqual('original');
    expect(getResult.body.price).toEqual(0);
    expect(getResult.body.keywords).toEqual(['original']);
  });
});

describe("PUT /crud", () => {
  beforeAll(async () => {
    const record = {
      name: 'original',
      price: 0,
      keywords: ['original'],
    };

    await request("localhost:9999").post("/crud/").send(record);
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

  it("OK, if ID is given", async () => {
    const record = {
      id: 0,
      name: 'original',
      price: 0,
      keywords: ['original'],
    };

    const insert = await request("localhost:9999").post("/crud").send(record);

    const updated_product = {
      name: "update",
      price: 1000,
      keywords: ['key1', 'key2', 'key3'],
    };

    const res = await request("localhost:9999").put(`/crud/${insert.body.id}`).send(updated_product);

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
