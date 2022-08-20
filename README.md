# mongo-backup

Note this package depends on [MongoDb Database tools](https://www.mongodb.com/docs/database-tools/installation/installation`).
Make sure you have it installed in your machine.


There are two ways to go about this:
- [Npx](#npx)
- [Host Locally](#host-locally)


First create a .env file of this format
```dotenv
DB_USER=
DB_NAME=
DB_PASSWORD=
DB_SERVER=
```


## Npx
```bash
npx @trapcode/mongodb-backup backup
npx @trapcode/mongodb-backup restore

# custom env file
npx @trapcode/mongodb-backup backup .backup.env
npx @trapcode/mongodb-backup restore .restore.env
```

## Host Locally
- Clone this repo.
- Create .env file

```bash
node index.js backup
node index.js restore

# custom env file
node index.js backup .backup.env
node index.js restore .restore.env
```
