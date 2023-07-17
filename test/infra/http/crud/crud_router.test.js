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
    it("Not found, if no ID is given", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)("localhost:9999").put("/crud/");
        expect(res.statusCode).toBe(404);
    }));
    it("OK, if ID is given", () => __awaiter(void 0, void 0, void 0, function* () {
        const updated_product = {
            name: "update",
            price: 1000,
            keywords: ['key1', 'key2', 'key3'],
        };
        const id = "id";
        const res = yield (0, supertest_1.default)("localhost:9999").put(`/crud/${id}`).send(updated_product);
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
});
