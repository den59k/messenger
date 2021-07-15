import getSchema from "../../libs/schema";

export const userInfoSchema = getSchema({
  name: { type: "string" },
  status: { type: "string" }
})