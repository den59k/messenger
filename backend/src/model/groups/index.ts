import Model from "../model";

export default class GroupsModel extends Model {

  async getList ({ user_id }){
    const resp = await this.db.query(`
      SELECT id, name, access, avatar, users_count, creator_id FROM groups 
      LEFT JOIN users_groups ON users_groups.group_id = groups.id
      LEFT JOIN ( SELECT group_id, COUNT(1) users_count FROM users_groups GROUP BY group_id ) T ON T.group_id = groups.id
      WHERE users_groups.user_id = $1
    `, [ user_id ])
    return resp.rows
  }

  async getOtherList ({ user_id }){
    const resp = await this.db.query(`
      SELECT id, name, access, avatar, users_count, creator_id FROM groups 
      LEFT JOIN ( SELECT group_id, COUNT(1) users_count FROM users_groups GROUP BY group_id ) T ON T.group_id = groups.id
      WHERE access = 'public' AND NOT EXISTS (
        SELECT 1 FROM users_groups WHERE users_groups.user_id=$1 AND users_groups.group_id = groups.id
      )
    `, [ user_id ])
    return resp.rows
  }

  async get ({ group_id, user_id }){
    const resp = await this.db.query(`
      SELECT 
        id, name, access, avatar, users_count, creator_id,
        EXISTS(SELECT 1 FROM users_groups WHERE group_id=$1 AND user_id=$2) AS consists
      FROM groups 
      LEFT JOIN ( SELECT group_id, COUNT(1) users_count FROM users_groups GROUP BY group_id ) T ON T.group_id = groups.id
      WHERE id = $1
    `, [ group_id, user_id ])
    return resp.rows[0]
  }

  async add({ name, access, creator_id }){
    const client = await this.db.connect()

    try{
      await client.query('BEGIN')

      const group_resp = await client.query(
        "INSERT INTO groups (name, access, creator_id, creation_time) VALUES ($1, $2, $3, $4) RETURNING id",
        [ name, access, creator_id, Date.now() ]
      )
      
      await client.query( "INSERT INTO users_groups VALUES ($1, $2)", [ creator_id, group_resp.rows[0].id ] )

      await client.query('COMMIT')
      return group_resp.rows[0]
    } catch (e){
      await client.query("ROLLBACK")
      throw e
    } finally{
      client.release(true)
    }
  }

  async addUserToGroup({ group_id, user_id }){
    const resp = await this.db.query(
      `INSERT INTO users_groups VALUES ($1, $2)`, 
      [ user_id, group_id ]
    )
    return resp.rowCount
  }

  async getUserList ({ group_id }){
    const resp = await this.db.query(
      `SELECT user_id FROM users_groups WHERE group_id=$1`,
      [ group_id ]
    )
    return resp.rows.map(item => item.user_id)
  }

  async delete({ group_id }){
    const resp = await this.db.query(`DELETE FROM groups WHERE id = $1`, [ group_id ])
    await this.db.query(`DELETE FROM users_groups WHERE group_id = $1`, [ group_id ])

    return resp.rowCount
  }

}