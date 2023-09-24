"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const crud_controller_1 = __importStar(require("../../src/crud/crud_controller"));
const crud_repo_i_1 = require("../../src/crud/repos/crud_repo_i");
const search_1 = __importDefault(require("../../src/search/search"));
const crudController = crud_controller_1.default.newDummyCrudController();
const searchController = search_1.default.newDummySearchController();
describe("crud controller create", () => {
    it("inserts a new record", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield crudController.create("name", 5, ["keywords"]);
        expect(result.failure).not.toBeTruthy();
        const created = yield searchController.fetch(result.results.at(0).id);
        expect(created.name).toEqual("name");
        expect(created.price).toEqual(5);
        expect(created.keywords).toEqual(["keywords"]);
        expect(created.id).not.toBeUndefined();
    }));
});
describe("crud controller update", () => {
    it("updates an existing record", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield crudController.create("name", 5, ["keywords"]);
        const created = result.results.at(0);
        const updatedResult = yield crudController.update(created.id, "updated name", 10, ["updated", "keywords"]);
        console.log(`[updated result]`, updatedResult);
        expect(updatedResult instanceof crud_controller_1.Updated).toBeTruthy();
        expect(updatedResult.failure).not.toBeTruthy();
        expect(updatedResult.message).toEqual(crud_repo_i_1.UpdateSuccessMessage);
        expect(updatedResult.results.length).toEqual(1);
        const updated = updatedResult.results.at(0);
        expect(updated.name).toEqual("updated name");
        expect(updated.price).toEqual(10);
        expect(updated.keywords).toEqual(["updated", "keywords"]);
    }));
    it("returns not found, if the record doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const randomId = Math.floor(Math.random() * 1000).toString();
        const updatedName = "updated name";
        const updatedPrice = Math.floor(Math.random() * 1000);
        const updatedKeywords = ["updated", "keywords"];
        const result = yield crudController.update(randomId, updatedName, updatedPrice, updatedKeywords);
        expect(result instanceof crud_controller_1.NotFound).toBeTruthy();
    }));
});
describe("crud controller remove", () => {
    it("removes an existing record", () => __awaiter(void 0, void 0, void 0, function* () {
        const createResult = yield crudController.create("name", 10, ["keywords"]);
        const toRemove = createResult.results.at(0);
        const removeResult = yield crudController.remove(createResult.results.at(0).id);
        expect(removeResult instanceof crud_controller_1.Removed).toBeTruthy();
        expect(removeResult.results.length).toEqual(1);
        expect(removeResult.results.at(0)).toEqual(toRemove.id);
        const findResult = yield searchController.fetch(toRemove.id);
        expect(findResult).toBeNull();
    }));
    it("returns Not Found if the record doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const randomId = Math.floor(Math.random() * 1000).toString();
        const removeResult = yield crudController.remove(randomId);
        expect(removeResult instanceof crud_controller_1.NotFound);
    }));
});
describe("crud controller find", () => {
    it("finds an existing record", () => __awaiter(void 0, void 0, void 0, function* () {
        const createRecord = yield crudController.create("name", 10, ["keywords"]);
        const toFind = createRecord.results.at(0);
        const found = yield searchController.fetch(toFind.id);
        expect(found.name).toEqual("name");
        expect(found.id).toEqual(toFind.id);
        expect(found.keywords).toEqual(["keywords"]);
        expect(found.price).toEqual(10);
    }));
    it("returns not found when the record doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const randomId = Math.floor(Math.random() * 1000).toString();
        const findResults = yield searchController.fetch(randomId);
        expect(findResults).toBeNull();
    }));
});
describe("crud controller bulk insert", () => {
    it.only("successfully creates each new record", () => __awaiter(void 0, void 0, void 0, function* () {
        const productCount = Math.floor(Math.random() * 10000);
        const products = [];
        for (let i = 0; i < productCount; ++i) {
            products.push({
                name: `product ${i}`,
                price: Math.floor(Math.random() * 1000),
                keywords: ['mock', 'key', 'word'],
            });
        }
        const response = yield crudController.bulk_insert(products);
        expect(response.results.length).toEqual(productCount);
        expect(response.failure).toBeFalsy();
        // var in !== var of
        for (var id of response.results) {
            console.log('find id: ', id);
            const product = yield searchController.fetch(id);
            expect(product).not.toBeNull();
        }
        for (var id of response.results) {
            const deleteResult = yield crudController.remove(id);
            expect(deleteResult instanceof crud_controller_1.NotFound).toBeFalsy();
            expect(deleteResult.failure).toBeFalsy();
        }
    }));
});
