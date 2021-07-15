import getSchema from "../../libs/schema";

export const loginSchema = getSchema({
  login: { type: "string" },
  password: { type: "string" },
})

export const registerSchema = getSchema({
  name: { type: "string" },
  login: { type: "string" },
  password: { type: "string" },
})

export const tokenSchema = getSchema({
  refreshToken: { type: "string" }
})