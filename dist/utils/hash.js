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
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const crypto_1 = require("crypto");
const hashPassword = (value, saltRounds) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, bcrypt_1.hash)(value, saltRounds);
    return result;
});
const hashValidation = (value, compareValue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isMatch = yield (0, bcrypt_1.compare)(value, compareValue);
        return isMatch;
    }
    catch (error) {
        console.error("Error during hash comparison:", error);
        return false;
    }
});
const hmacProcess = (value, key) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, crypto_1.createHmac)("sha256", key).update(value).digest("hex");
    return result;
});
const hashpass = {
    hashValidation,
    hashPassword,
    hmacProcess,
};
exports.default = hashpass;
