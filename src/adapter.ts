import type { Adapter } from 'east';
import path from 'path';
import { validateCredentials, Credentials } from './helpers';
import { Surreal } from 'surrealdb.js';

class SurrealDBAdapter implements Adapter<Surreal> {
  private db: Surreal = new Surreal()

  private url: string;
  private credentials: Credentials;
  private migrationTable: string;

  constructor({ url, credentials, migrationTable }: { url: string, credentials: Credentials, migrationTable: string }) {
    if (!url) {
      throw new Error('Missing property for SurrealDB East adapter in .eastrc: "url"')
    }

    this.url = url

    if (!credentials) {
      throw new Error('Missing property for SurrealDB East adapter in .eastrc: "credentials"')
    } else {
      validateCredentials(credentials)
    }

    this.credentials = credentials

    this.migrationTable = migrationTable ?? '_migration'
  }

  async connect(): Promise<Surreal> {
    await this.db.connect(this.url)

    await this.db.signin(this.credentials)

    await this.db.query(`DEFINE TABLE ${this.migrationTable} SCHEMAFULL`)
    await this.db.query(`DEFINE FIELD name ON TABLE ${this.migrationTable} TYPE string`)
    await this.db.query(`DEFINE INDEX nameIndex ON TABLE ${this.migrationTable} COLUMNS name UNIQUE`)
    await this.db.query(`DEFINE FIELD date ON TABLE ${this.migrationTable} TYPE datetime DEFAULT time::now()`)

    return this.db
  }
  async disconnect(): Promise<void> {
    await this.db.invalidate();
  }
  getTemplatePath(sourceMigrationExtension: string): string {    
    return path.join(__dirname, '..', 'migrationTemplates', ('async.' + sourceMigrationExtension));
  }
  async getExecutedMigrationNames(): Promise<string[]> {
    const result: MigrationRecord[] = (await this.db.query(`SELECT name FROM ${this.migrationTable}`))
    
    const names = Array.isArray(result[0]) ? result[0].map(({ name }: { name: string }) => name) : [];

    return names
  }
  async markExecuted(migrationName: string): Promise<void> {
    await this.db.create(this.migrationTable, {
      name: migrationName
    })
  }
  async unmarkExecuted(migrationName: string): Promise<void> {
    await this.db.query(`DELETE ${this.migrationTable} WHERE name = "${migrationName}"`)
  }
}

export = SurrealDBAdapter;