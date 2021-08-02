import Model from "../model";

export default class UsersModel extends Model {
  async getList (){
    const resp = await this.db.query(
      `SELECT id, name, login, status, avatar FROM users ORDER BY id DESC`
    )
    return resp.rows
  }

  async get({ user_id }){
    const resp = await this.db.query(
      `SELECT id, name, login, status, avatar FROM users WHERE id=$1`,
      [ user_id ]
    )
    return resp.rows[0]
  }

  async getMultiple(ids: Array<number>){
    const resp = await this.db.query(`
      SELECT id, name, login, avatar FROM users WHERE id = ANY($1::int[])
    `, [ ids ])
    return resp.rows
  }
}