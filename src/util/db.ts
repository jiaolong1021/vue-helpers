import { window } from "vscode";
import { Client } from 'pg'
import * as mysql from 'mysql2';

export interface Db {
  type: string
  host: string
  port: string
  database: string
  user: string
  password: string
  mode?: string
}

export class DbFactory {
  public client: any
  public dbData: any
  public isConnect: boolean = false
  public type: string = ''

  constructor(dbData: Db) {
    this.dbData = dbData
    if (dbData.type === 'postgres') {
      this.type = 'postgres'
      this.client = new Client({
        host: dbData.host,
        port: dbData.port ? parseInt(dbData.port) : 5432,
        database: dbData.database,
        user: dbData.user,
        password: dbData.password,
      })
      this.pgConnectTesting()
    } else if (dbData.type === 'mysql') {
      this.type = 'mysql'
      this.client = mysql.createConnection({
        host: dbData.host,
        port: dbData.port ? parseInt(dbData.port) : 3306,
        database: dbData.database,
        user: dbData.user,
        password: dbData.password,
      })
      this.mysqlConnectTesting()
    }
  }

  public async pgConnectTesting() {
    try {
      await this.client.connect()
      this.isConnect = true
      window.showInformationMessage('数据库连接成功')
    } catch (error) {
      this.isConnect = false
      window.showErrorMessage('数据库连接失败')
    }
  }

  public async pgClose() {
    await this.client.end()
  }

  public async mysqlConnectTesting() {
    let that = this
    this.client.connect(function(err: any) {
      if (err) {
        console.log(err)
        that.isConnect = false
        window.showErrorMessage('数据库连接失败')
        return
      }
      that.isConnect = true
      window.showInformationMessage('数据库连接成功')
    })
  }

  public async mysqlClose() {
    this.client.end()
  }
}