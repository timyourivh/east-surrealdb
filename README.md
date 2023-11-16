<p align="center" style="background-color: #000; width: 100%; padding: 24px;">
  <img alt="SurrealDB Logo" src="https://surrealdb.com/static/img/text-be42529fe0e268f3fbabfb42065eeec7.svg" style="height: 50px;">
</p>

---

<h1 align="center">East Adapter</h1>

Introducing the SurrealDB adapter for east – seamlessly integrate SurrealDB, the cloud-native database designed for modern applications, into your migration workflow. With this adapter, east facilitates smooth database migrations, connecting your application to SurrealDB effortlessly. Streamline your development process, reduce complexity, and ensure secure, high-performance migrations with SurrealDB and east.

---

### 🤓 Prerequisites:

To be able to use this you need the `surreal.js`, `east` packages installed. 

---

### 💻 Installation:

```bash
pnpm add east-surrealdb
# Or
yarn add east-surrealdb
# Or
npm install east-surrealdb
```

---

### ⚙️ Configuration:

To make it work with your database you need to configure the adapter using the .eastrc file. Here's an example of what it could look like:

> [!NOTE]  
> Always keep your database credentials safe and secure and never commit them to GitHub. You can do this by storing them in a `.env` file and adding that file to your `.gitignore`.

```js
require('dotenv').config();

module.exports = {
  adapter: "east-surrealdb",
  url: process.env.DB_URL ?? "http://127.0.0.1:8000/rpc",
  credentials: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    namespace: process.env.DB_NAMESPACE,
    database: process.env.DB_DATABASE
  }
}
```

---

### 🚀 Usage:

Create a migration using the `east create <name>`. With this adapter in use it will generate a migration file that looks like this:

```js
const { Surreal } = require('surrealdb.js')

exports.migrate = async (db) => {
  db = Object.assign(new Surreal(), db)
  
  // Migration instructions
}

exports.rollback = async (db) => {
  db = Object.assign(new Surreal(), db)

  // Rollback instructions
}
```

Inside the migrate and rollback sections you can write SurrealDB queries using the Surreal instance.

> [!NOTE]
> I used `db = Object.assign(new Surreal(), db)` to inject the configuration into a new instance as the instance returned is not a Surreal class but an object. If someone knows a cleaner solution please feel free to PR or let me know.

#### For example:

```js
// migrations/1_create_test_table.js

const { Surreal } = require("surrealdb.js")

exports.migrate = async (db) => {
  db = Object.assign(new Surreal(), db)
  
  await db.query('DEFINE TABLE test SCHEMAFULL')
  await db.query('DEFINE FIELD name ON TABLE test TYPE string')
}

exports.rollback = async (db) => {
  db = Object.assign(new Surreal(), db)

  await db.query('REMOVE TABLE test')
}
```

This example creates a schemafull table named "test" and adds a field named "name" to it with type "string".When rolling back this migration it will "remove" the table making this migration undone.

--- 

### 🤝 Contributing:

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

### ⚠️ Disclaimer:

I am not part of or affiliated with the SurrealDB team. I am simply an enthusiast of SurrealDB, eager to share my passion and insights. Any views or opinions expressed are solely my own and do not reflect the official stance of SurrealDB or its developers.

### 📜 License:

```
Copyright © 2023, Tim Youri van Herwijnen

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```