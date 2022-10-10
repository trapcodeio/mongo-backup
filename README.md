# mongo-backup

Note this package depends on [MongoDb Database tools](https://www.mongodb.com/docs/database-tools/installation/installation).
Make sure you have it installed in your machine.

## Configure using environment variables
First create a .env file of this format
```dotenv
# Required
DB_SERVER=

# Optional
DB_USER=
DB_NAME=
DB_PASSWORD=
```

**Note:** `DB_USER`, `DB_NAME` and `DB_PASSWORD` are optional. This is because they can be present in the `DB_SERVER` string.

If your `DB_SERVER` string has placeholders for `user`, `password` or `database` the env variables will be used to replace them.
For example
```
<user> = DB_USER
<password> = DB_PASSWORD (Encoded)
<database> = DB_NAME
```

with the above example given
```dotenv
DB_PASSWORD=hello@world
DB_NAME=myapp
DB_SERVER="mongodb+srv://admin:<password>@server3.mongodb.net/<database>?retryWrites=true&w=majority"

# server string will be converted to
# mongodb+srv://admin:hello%40world@server3.mongodb.net/myapp?retryWrites=true&w=majority"
```


## Backup or Restore

There are two ways to go about this:
- [Npx](#npx)
- [Host Locally](#host-locally)

### Npx
```bash
npx @trapcode/mongodb-backup backup
npx @trapcode/mongodb-backup restore

# custom env file
npx @trapcode/mongodb-backup backup .backup.env
npx @trapcode/mongodb-backup restore .restore.env
```

### Host Locally
- Clone this repo.
- Create .env file

```bash
node index.js backup
node index.js restore

# custom env file
node index.js backup .backup.env
node index.js restore .restore.env
```
