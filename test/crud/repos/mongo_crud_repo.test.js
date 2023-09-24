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
const mongodb_1 = require("mongodb");
const mongo_crud_repo_1 = __importDefault(require("../../../src/crud/repos/mongo_crud_repo"));
const mongo_search_repo_1 = __importDefault(require("../../../src/search/repos/mongo_search_repo"));
const repo = mongo_crud_repo_1.default.newRepo();
const searchRepo = mongo_search_repo_1.default.newRepo();
describe("Mongo-backed Crud Repo", () => {
    it("inserts valid records", () => __awaiter(void 0, void 0, void 0, function* () {
        const product = {
            name: "name",
            price: 10,
            keywords: ["key", "word"],
        };
        const insertResult = yield repo.insert(product);
        expect(insertResult.failure).toBeFalsy();
        const deleteResult = yield repo.remove(insertResult.id);
        expect(deleteResult.failure).toBeFalsy();
        const searchResult = yield searchRepo.find_by_id(insertResult.id);
        expect(searchResult).toBeNull();
    }));
    it("updates existing records", () => __awaiter(void 0, void 0, void 0, function* () {
        const product = {
            name: "name",
            price: 10,
            keywords: ["key", "word"],
        };
        const insertResult = yield repo.insert(product);
        expect(insertResult.failure).toBeFalsy();
        const updateResult = yield repo.update({
            id: insertResult.id,
            name: "new name",
            price: 20,
            keywords: ["new", "key", "word"],
        });
        expect(updateResult.failure).toBeFalsy();
        expect(updateResult.id.toString()).toEqual(insertResult.id);
        expect(updateResult.records.length).toEqual(1);
        expect(updateResult.records.at(0)).toEqual({
            _id: new mongodb_1.ObjectId(insertResult.id),
            name: "new name",
            price: 20,
            keywords: ["new", "key", "word"],
        });
        const searchResult = yield searchRepo.find_by_id(insertResult.id);
        expect(searchResult).not.toBeNull();
        expect(searchResult.id).toEqual(insertResult.id);
        expect(searchResult.name).toEqual("new name");
        expect(searchResult.price).toEqual(20);
        expect(searchResult.keywords).toEqual(["new", "key", "word"]);
        const deleteResult = yield repo.remove(insertResult.id);
        expect(deleteResult.failure).toBeFalsy();
    }));
    it("returns failure when updating unknown records", () => __awaiter(void 0, void 0, void 0, function* () {
        const randomId = "000000000000";
        const updateResult = yield repo.update({
            id: randomId,
            name: "new name",
            price: 20,
            keywords: ["new", "key", "word"],
        });
        expect(updateResult.failure).toBeTruthy();
        expect(updateResult.message).toEqual(`failed to update ${randomId}`);
    }));
    it("returns failure when updating with invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidId = "0";
        const updateResult = yield repo.update({
            id: invalidId,
            name: "new name",
            price: 20,
            keywords: ["new", "key", "word"],
        });
        console.log(updateResult);
        expect(updateResult.failure).toBeTruthy();
        expect(updateResult.message).toEqual('BSONError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer');
    }));
    it("fails when removing a record that doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const randomId = "000000000000";
        const deleteResult = yield repo.remove(randomId);
        expect(deleteResult.failure).toBeTruthy();
        expect(deleteResult.message).toEqual(`not found: ${randomId}`);
    }));
    it("fails when deleting with an invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidId = "0";
        const deleteResult = yield repo.remove(invalidId);
        console.log(deleteResult);
        expect(deleteResult.failure).toBeTruthy();
        expect(deleteResult.message).toEqual('BSONError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer');
    }));
});
