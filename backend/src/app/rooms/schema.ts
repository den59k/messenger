import getSchema from "../../libs/schema";

export const roomParamsSchema = getSchema({
  room_id: { type: "string" }
}, "params")

export const produceSchema = getSchema({
  offer: { type: ["object", "null"] },
  userId: { type: "string" }
})

export const consumeSchema = getSchema({
  answer: { type: "object" },
  userId: { type: "string" }
})

export const userIdSchema = getSchema({
  userId: { type: "string" }
})