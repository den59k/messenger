import Model from "../model";

class CallsModel extends Model {

  async add({ conf_id, caller_id, room_id }){
    const client = await this.db.connect()
    try{
      await client.query('BEGIN')

      const _confInfo = await this.db.query(`
        UPDATE confs SET last_call_id = last_call_id+1 WHERE id=$1 RETURNING last_call_id
      `, [ conf_id ])

      const { last_call_id } = _confInfo.rows[0]

      const resp = await this.db.query(`
        INSERT INTO calls (id, conf_id, caller_id, time, status, room_id) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id, conf_id, caller_id, time, status
      `, [ last_call_id, conf_id, caller_id, Date.now(), (room_id? "active": "waiting"), room_id ])

      await client.query('COMMIT')
      return resp.rows[0]
    }catch(e){
      await client.query('ROLLBACK')
      throw e
    }finally{
      client.release()
    }
  }

  async getLastCall ({ conf_id}){
    const resp = await this.db.query(`
      SELECT id, room_id, time, status FROM calls WHERE conf_id = $1 ORDER BY time DESC LIMIT 1
    `, [ conf_id ])
    return resp.rows[0]
  }

  async update({ call_id, status }){
    const resp = await this.db.query(`
      UPDATE calls SET status = $2 WHERE id = $1
    `, [ call_id, status ])
    return resp
  }

}

export default CallsModel