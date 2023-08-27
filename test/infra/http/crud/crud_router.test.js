"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
describe("PUT /crud", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const record = {
            name: 'original',
            price: 0,
            keywords: [],
        };
        const res = yield (0, supertest_1.default)("localhost:9999").post("/crud/").send(record);
    }));
    it("Not found, if no ID is given", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)("localhost:9999").put("/crud/");
        expect(res.statusCode).toBe(404);
    }));
    it("Not found, if ID is not recognized", () => __awaiter(void 0, void 0, void 0, function* () {
        const randomId = Math.floor(Math.random() * 1000) + 1000;
        const res = yield (0, supertest_1.default)("localhost:9999").put(`/crud/${randomId}`);
        expect(res.statusCode).toBe(404);
    }), 30000);
    it.only("OK, if ID is given", () => __awaiter(void 0, void 0, void 0, function* () {
        const record = {
            id: 0,
            name: 'original',
            price: 0,
            keywords: [],
        };
        const insert = yield (0, supertest_1.default)("localhost:9999").post("/crud").send(record);
        console.log('insert', insert);
        const updated_product = {
            name: "update",
            price: 1000,
            keywords: ['key1', 'key2', 'key3'],
        };
        const res = yield (0, supertest_1.default)("localhost:9999").put(`/crud/${record.id}`).send(updated_product);
        expect(res.statusCode).toBe(200);
    }));
    it("Bad Request, if price is negative", () => __awaiter(void 0, void 0, void 0, function* () {
        const updated_product = {
            name: "update",
            price: -1,
            keywords: ['key1', 'key2', 'key3'],
        };
        const id = "id";
        const res = yield (0, supertest_1.default)("localhost:9999").put(`/crud/${id}`).send(updated_product);
        expect(res.statusCode).toBe(400);
    }));
    it("Bad Request, if name is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const updated_product = {
            name: "",
        };
        const id = "id";
        const res = yield (0, supertest_1.default)("localhost:9999").put(`/crud/${id}`).send(updated_product);
        expect(res.statusCode).toBe(400);
    }));
    it("Bad Request, if keywords is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const updated_product = {
            keywords: []
        };
        const id = "id";
        const res = yield (0, supertest_1.default)("localhost:9999").put(`/crud/${id}`).send(updated_product);
        expect(res.statusCode).toBe(400);
    }));
});
describe("POST /crud", () => {
    it("Bad Request, if price is negative", () => __awaiter(void 0, void 0, void 0, function* () {
        const updated_product = {
            name: "update",
            price: -1,
            keywords: ['key1', 'key2', 'key3'],
        };
        const id = "id";
        const res = yield (0, supertest_1.default)("localhost:9999").put(`/crud/${id}`).send(updated_product);
        expect(res.statusCode).toBe(400);
    }));
    it("Bad Request, if name is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const updated_product = {
            name: "",
        };
        const id = "id";
        const res = yield (0, supertest_1.default)("localhost:9999").put(`/crud/${id}`).send(updated_product);
        expect(res.statusCode).toBe(400);
    }));
    it("Bad Request, if keywords is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const updated_product = {
            keywords: []
        };
        const id = "id";
        const res = yield (0, supertest_1.default)("localhost:9999").put(`/crud/${id}`).send(updated_product);
        expect(res.statusCode).toBe(400);
    }));
});
