import Model from "../model";

export default class TokensModel extends Model {

  async get ({ token }) {
    const resp = await this.db.query(`
      SELECT * FROM refresh_tokens WHERE token = $1
    `, [ token ])

    return resp.rows[0]
  }

  async add ({ user_id, token }) {
    const resp = await this.db.query(`
      INSERT INTO refresh_tokens (user_id, token, timestamp) VALUES ($1, $2, $3)
    `, [ user_id, token, Date.now() ])

    return resp.rowCount
  }

  async delete ({ token }) {
    const resp = await this.db.query(`
      DELETE FROM refresh_tokens WHERE token = $1
    `, [ token ])
    return resp.rowCount
  }
}