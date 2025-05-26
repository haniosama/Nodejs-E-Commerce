import { compare, hash } from "bcrypt";
import { createHmac } from "crypto";

const hashPassword = async (
  value: string,
  saltRounds: number
): Promise<string> => {
  const result = await hash(value, saltRounds);
  return result;
};

const hashValidation = async (
  value: string,
  compareValue: string
): Promise<boolean> => {
  try {
    const isMatch = await compare(value, compareValue);
    return isMatch;
  } catch (error) {
    console.error("Error during hash comparison:", error);
    return false;
  }
};

const hmacProcess = async (value: string, key: string): Promise<string> => {
  const result = createHmac("sha256", key).update(value).digest("hex");
  return result;
};

const hashpass = {
  hashValidation,
  hashPassword,
  hmacProcess,
};

export default hashpass;
