import { FastifySchema } from "fastify";

type schemaName = 'body' | 'params' | 'querystring' | 'headers'

export default function getSchema (properties: any, key: schemaName = 'body'): FastifySchema {
	
	const schema = {
		[key]: {
			type: "object",
			properties,
			required: Object.keys(properties).filter(key => properties[key].r !== false)
		}
	}

	return schema
}