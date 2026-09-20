import bcrypt from "bcryptjs";

const hashValue = async function (
    value: string,
    saltRounds?: number,
): Promise<string> {
    return bcrypt.hash(value, saltRounds || 10);
};

const compareValue = async function (
    value: string,
    hashedValue: string,
): Promise<boolean> {
    return bcrypt.compare(value, hashedValue).catch(() => false);
};

export {hashValue, compareValue}
