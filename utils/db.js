const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const MongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://arijitkundu333:arijit2907@cluster0.cav3m.mongodb.net/sample_ecommerce"
  )
    .then((client) => {
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDB = () => {
  if (_db) {
    return _db;
  }
};

exports.MongoConnect = MongoConnect;
exports.getDB = getDB;
