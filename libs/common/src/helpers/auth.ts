import * as crypto from "node:crypto";

export const matchRoles = (roles, userRoles) => {
  return roles.some((role) => userRoles.includes(role));
};

export const hashString = (password) => {
  const hash = crypto.createHmac("sha256", process.env.SECRET_AUTH_KEY);
  hash.update(password);
  return hash.digest("hex");
};

export function generateResetToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(20, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        const token = buf.toString("hex");
        resolve(token);
      }
    });
  });
}

const encryptionKey = process.env.ENCRYPTION_KEY;
const key = crypto.createHash("sha256").update(encryptionKey, "utf-8").digest();

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16); // Initialization Vector
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

// Decryption
export function decrypt(text: string) {
  const [iv, encryptedText] = text.split(":");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), Buffer.from(iv, "hex"));

  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
}
