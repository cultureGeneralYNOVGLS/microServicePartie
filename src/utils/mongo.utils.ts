const mongodb = require('mongodb');
import * as mongoDB from "mongodb";

let mongodbClient: any;
let db: mongoDB.Db;
const URI_MONGO: string = "mongodb://127.0.0.1:27017"
const DB_MONGO: string = "YNOVGLS"

export class MongoUtils {

    public dbConnect() {
        return new Promise((resolve, reject) => {
            if (db) {
                resolve(db);
            } else {
                mongodb.MongoClient.connect(URI_MONGO, function (err: any, client: any) {
                    if (err) {
                        console.error('Error connecting to the MongoDB URL: ' + URI_MONGO);
                        reject(err);
                    }
                    mongodbClient = client;
                    db = mongodbClient.db(DB_MONGO);
                    // Make sure connection closes when Node exits
                    process.on('exit', (code) => {
                        this.dbClose();
                    })
                    resolve(db);
                });
            }
        });
    }

    public dbClose() {
        if (mongodbClient && mongodbClient.isConnected()) {
            mongodbClient.close();
        }
    }

}