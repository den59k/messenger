import type { Pool } from 'pg'
import initDB from '../libs/init-db'

import AccountModel from './account'
import TokensModel from './tokens'
import GroupsModel from './groups'
import UsersModel from './users'
import MessagesModel from './messages'

export default class AppModel {

	db: Pool
  account: AccountModel
  tokens: TokensModel
	groups: GroupsModel
	users: UsersModel
	messages: MessagesModel

	constructor(){
	}

	async init (){
		this.db = initDB()
    this.account = new AccountModel(this.db)
    this.tokens = new TokensModel(this.db)
		this.groups = new GroupsModel(this.db)
		this.users = new UsersModel(this.db)
		this.messages = new MessagesModel(this.db)
	}
}