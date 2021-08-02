import getSchema from "../../libs/schema";

export const userParamsSchema = getSchema({
  user_id: { type: "number" }
}, 'params')

export const groupParamsSchema = getSchema({
  group_id: { type: "number" }
}, "params")

export const callParamsSchema = getSchema({
  call_id: { type: "number" }
}, "params")

export const inviteCallSchema = getSchema({
  wsId: { type: "string" }
})