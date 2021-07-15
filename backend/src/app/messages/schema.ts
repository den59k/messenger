import getSchema from "../../libs/schema";

export const userMessagesParamsSchema = getSchema({
  user_id: { type: "number" }
}, 'params')

export const groupMessagesParamsSchema = getSchema({
  group_id: { type: "number" }
}, "params")

export const messageSchema = getSchema({
  text: { type: "string" }
})