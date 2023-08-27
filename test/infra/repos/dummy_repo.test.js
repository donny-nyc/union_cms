"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dummy_repo_1 = __importDefault(require("../../../src/infra/repos/dummy_repo"));
const repository_1 = require("../../../src/types/repository");
describe("insert into dummy repo", () => {
    it('Returns Success', () => {
        const record = {
            name: 'record',
            price: 0,
            keywords: ['keyword']
        };
        const result = dummy_repo_1.default.insert(record);
        expect(result.failure).not.toBeTruthy();
        expect(result.message).toEqual(repository_1.CreateSuccessMessage);
    });
});
describe("update through dummy repo", () => {
    it("Succeeds and replaces the original", () => {
        const original = {
            id: 'id',
            value: 'original',
        };
        const updated = {
            id: original.id,
            value: 'updated',
        };
        dummy_repo_1.default.insert(original);
        const result = dummy_repo_1.default.update(updated);
        expect(result.failure).not.toBeTruthy();
        expect(result.message).toEqual(UpdateSuccessMesssage);
        expect(result.results.at(0)).toBe(updated);
    });
});
describe("find a record in dummy repo", () => {
    it("Succeeds and returns the record when it exists", () => {
        const record = {
            id: "id",
        };
        dummy_repo_1.default.insert(record);
        const result = dummy_repo_1.default.find(record.id);
        expect(result instanceof Success).toBeTruthy();
        expect(result.results.length).toBe(1);
        expect(result.results.at(0)).toBe(record);
    });
    it("NotFound when the record does not exist", () => {
        const record = {
            id: "id",
        };
        dummy_repo_1.default.insert(record);
        const randomId = Math.floor(Math.random() * 1000) + 1000;
        const result = dummy_repo_1.default.find(`${randomId}`);
        expect(result instanceof RecordNotFound).toBeTruthy();
    });
    it("NotFound when no record exists", () => {
        const randomId = Math.floor(Math.random() * 1000) + 1000;
        const result = dummy_repo_1.default.find(`${randomId}`);
        expect(result instanceof RecordNotFound).toBeTruthy();
    });
});
describe("remove from dummy repo", () => {
    it("Succeeds and removes the record", () => {
        const record = {
            id: "id"
        };
        dummy_repo_1.default.insert(record);
        dummy_repo_1.default.remove(record.id);
        const result = dummy_repo_1.default.find(record.id);
        expect(result instanceof RecordNotFound).toBeTruthy();
    });
    it("NotFound when the record does not exist", () => {
        const record = {
            id: "id",
        };
        dummy_repo_1.default.insert(record);
        const randomId = Math.floor(Math.random() * 1000) + 1000;
        const result = dummy_repo_1.default.remove(`${randomId}`);
        expect(result instanceof RecordNotFound).toBeTruthy();
    });
});
