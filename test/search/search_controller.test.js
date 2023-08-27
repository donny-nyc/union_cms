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
const search_1 = __importDefault(require("../../src/search/search"));
const mock_products_1 = __importDefault(require("./mocks/mock_products"));
const searchController = search_1.default.newDummySearchController(mock_products_1.default);
describe("Search Controller", () => {
    it("returns results on keyword matches", () => __awaiter(void 0, void 0, void 0, function* () {
        const query = "snack";
        const searchResults = yield searchController.search(query);
        console.log('[results]', searchResults);
        expect(searchResults.length).toEqual(3);
    }));
    it("returns results on partial keyword matches", () => __awaiter(void 0, void 0, void 0, function* () {
        const query = "glut"; //en-free
        const searchResults = yield searchController.search(query);
        console.log('[results]', searchResults);
        expect(searchResults.length).toEqual(1);
    }));
    it("returns empty when no keywords match", () => __awaiter(void 0, void 0, void 0, function* () {
        const query = "garbage in";
        const searchResults = yield searchController.search(query);
        expect(searchResults.length).toEqual(0);
    }));
});
