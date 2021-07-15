import Model from "../model";

class MessagesModel extends Model {

  async add({ conf_id, from_id, text }){

    const client = await this.db.connect()

    try{
      await client.query('BEGIN')

      const _confInfo = await this.db.query(`
        UPDATE confs SET last_message_id = last_message_id+1 WHERE id=$1 RETURNING last_message_id
      `, [ conf_id ])

      const { last_message_id } = _confInfo.rows[0]

      const resp = await this.db.query(`
        INSERT INTO messages (id, conf_id, sender_id, text, time) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id, conf_id, sender_id, text, time
      `, [ last_message_id, conf_id, from_id, text, Date.now() ])

      await client.query('COMMIT')
      return resp.rows[0]
    }catch(e){
      await client.query('ROLLBACK')
      throw e
    }finally{
      client.release()
    }
  } 

  async addUserToConf ({ conf_id, user_id }){
    const resp = await this.db.query(
      `INSERT INTO user_conf VALUES ($1, $2)`,
      [ user_id, conf_id ]
    )
    return resp.rowCount
  }

  async getList({ conf_id }){
    const messages = await this.db.query(`
      SELECT messages.id, text, time,
      users.id sender_id, users.name sender_name, users.avatar sender_avatar
      FROM messages
      LEFT JOIN users ON users.id = sender_id
      WHERE conf_id = $1
      ORDER BY time DESC
    `, [ conf_id ])
    return messages.rows
  }

  async getConfList({user_id}){
    const resp = await this.db.query(`
      SELECT 
        users.id user_id, users.avatar user_avatar, users.name user_name,
        groups.id group_id, groups.avatar group_avatar, groups.name group_name,
        message.id message_id, message.sender_id message_sender_id, 
        message.sender_name message_sender_name, message.time message_time, message.text message_text,
        user_conf.last_message_id, user_conf.conf_id
      FROM user_conf
      LEFT JOIN ls_confs ON user_conf.conf_id = ls_confs.id
      LEFT JOIN group_confs ON user_conf.conf_id = group_confs.id
      LEFT JOIN (
        SELECT DISTINCT ON (conf_id) conf_id, messages.id, users.id sender_id, users.name sender_name, text, time
        FROM messages
        LEFT JOIN users ON users.id = messages.sender_id
        ORDER BY conf_id, messages.id DESC
      ) message ON message.conf_id = user_conf.conf_id
      LEFT JOIN users ON (
        ls_confs.user_one != $1 AND ls_confs.user_one = users.id 
        OR 
        ls_confs.user_one = $1 AND ls_confs.user_two = users.id 
      )
      LEFT JOIN groups ON group_confs.group_id=groups.id
      WHERE user_id=$1
      ORDER BY message_time DESC
    `, [ user_id ])
    return resp.rows
  }

  async getConf (users: Array<number>, create=false){
    users.sort()

    const confInfo = await this.db.query(`
      SELECT id, last_message_id, last_call_id FROM ls_confs WHERE user_one=$1 AND user_two=$2
    `, users)

    if(confInfo.rowCount > 0) return confInfo.rows[0]
    if(!create) return null

    const resp = await this.db.query(`
      INSERT INTO ls_confs (user_one, user_two) VALUES ($1, $2) RETURNING id, last_message_id, last_call_id
    `, users)
    const newConfInfo = resp.rows[0]

    await this.db.query(`
      INSERT INTO user_conf (conf_id, user_id) SELECT $1, unnest($2::int[]) ON CONFLICT DO NOTHING
    `, [ newConfInfo.id, users ])

    return newConfInfo
  }

  async getGroupConf ({ group_id }, create=false){
    const confInfo = await this.db.query(`
      SELECT id, last_message_id, last_call_id FROM group_confs WHERE group_id=$1
    `, [ group_id ])

    if(confInfo.rowCount > 0) return confInfo.rows[0]
    if(!create) return null

    const resp = await this.db.query(`
      INSERT INTO group_confs (group_id) VALUES ($1) RETURNING id, last_message_id, last_call_id
    `, [ group_id ])
    const newConfInfo = resp.rows[0]

    await this.db.query(`
      INSERT INTO user_conf (conf_id, user_id) 
      (SELECT $1, user_id FROM users_groups WHERE group_id=$2) 
      ON CONFLICT DO NOTHING
    `, [ newConfInfo.id, group_id ])

    return newConfInfo
  }
}

export default MessagesModel