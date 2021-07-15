import getSchema from "../../libs/schema";

export const addGroupSchema = getSchema({
  name: { type: "string" },
  access: { type: "string", enum: [ "public", "private" ] }
})

export const groupParamsSchema = getSchema({
  group_id: { type: "number" }
}, 'params')