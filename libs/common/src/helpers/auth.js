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
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = exports.generateResetToken = exports.hashString = exports.matchRoles = void 0;
const crypto = __importStar(require("node:crypto"));
const matchRoles = (roles, userRoles) => {
    return roles.some((role) => userRoles.includes(role));
};
exports.matchRoles = matchRoles;
const hashString = (password) => {
    const hash = crypto.createHmac("sha256", process.env.SECRET_AUTH_KEY);
    hash.update(password);
    return hash.digest("hex");
};
exports.hashString = hashString;
function generateResetToken() {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(20, (err, buf) => {
            if (err) {
                reject(err);
            }
            else {
                const token = buf.toString("hex");
                resolve(token);
            }
        });
    });
}
exports.generateResetToken = generateResetToken;
const encryptionKey = process.env.ENCRYPTION_KEY;
const key = crypto.createHash("sha256").update(encryptionKey, "utf-8").digest();
function encrypt(text) {
    const iv = crypto.randomBytes(16); // Initialization Vector
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
}
exports.encrypt = encrypt;
// Decryption
function decrypt(text) {
    const [iv, encryptedText] = text.split(":");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encryptedText, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}
exports.decrypt = decrypt;
