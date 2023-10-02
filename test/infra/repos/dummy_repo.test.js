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
const dummy_repo_1 = __importDefault(require("../../../src/crud/repos/dummy_repo"));
const crud_repo_i_1 = require("../../../src/crud/repos/crud_repo_i");
describe("insert into dummy repo", () => {
    it('Returns Success', () => __awaiter(void 0, void 0, void 0, function* () {
        const record = {
            name: 'record',
            price: 0,
            keywords: ['keyword']
        };
        const result = yield dummy_repo_1.default.insert(record);
        expect(result.failure).not.toBeTruthy();
        expect(result.message).toEqual(crud_repo_i_1.CreateSuccessMessage);
    }));
});
describe("update through dummy repo", () => {
    it("Succeeds and replaces the original", () => __awaiter(void 0, void 0, void 0, function* () {
        const original = {
            name: 'original',
            price: 1,
            keywords: ['keywords']
        };
        const insertResult = yield dummy_repo_1.default.insert(original);
        const updated = {
            id: insertResult.id,
            name: 'updated',
        };
        const result = yield dummy_repo_1.default.update(updated);
        expect(result.failure).not.toBeTruthy();
        expect(result.message).toEqual(crud_repo_i_1.UpdateSuccessMessage);
        expect(result.records.at(0)).toBe(updated);
    }));
});
describe("fetch a record in dummy repo", () => {
    it("Succeeds and returns the record when it exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const record = {
            id: "id",
        };
        yield dummy_repo_1.default.insert(record);
        const result = yield dummy_repo_1.default.find(record.id);
        expect(result.record).not.toBeNull();
        expect(result.record).toBe(record);
    }));
    it("NotFound when the record does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const record = {
            id: "id",
        };
        yield dummy_repo_1.default.insert(record);
        const randomId = Math.floor(Math.random() * 1000) + 1000;
        const result = yield dummy_repo_1.default.find(`${randomId}`);
        expect(result instanceof crud_repo_i_1.RecordNotFound).toBeTruthy();
    }));
    it("NotFound when no record exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const randomId = Math.floor(Math.random() * 1000) + 1000;
        const result = yield dummy_repo_1.default.find(`${randomId}`);
        expect(result instanceof crud_repo_i_1.RecordNotFound).toBeTruthy();
    }));
});
describe("remove from dummy repo", () => {
    it("Succeeds and removes the record", () => __awaiter(void 0, void 0, void 0, function* () {
        const record = {
            id: "id"
        };
        yield dummy_repo_1.default.insert(record);
        yield dummy_repo_1.default.remove(record.id);
        const result = yield dummy_repo_1.default.find(record.id);
        expect(result instanceof crud_repo_i_1.RecordNotFound).toBeTruthy();
    }));
    it("NotFound when the record does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const record = {
            id: "id",
        };
        yield dummy_repo_1.default.insert(record);
        const randomId = Math.floor(Math.random() * 1000) + 1000;
        const result = yield dummy_repo_1.default.remove(`${randomId}`);
        expect(result instanceof crud_repo_i_1.RecordNotFound).toBeTruthy();
    }));
});
