const mongodb = require('mongodb'); // return an mongodb object
// const MongoClient = mongodb.MongoClient;
const { MongoClient, ObjectId } = mongodb;
// MongoClient is used to connect to MongoDB server and Connect to DB

const connectionURL = 'mongodb://127.0.0.1:27017';
const dbName = 'users';

// ObjectId
// By default MongoDb will provide guid or objectid(to avoid id collision across several dbs)
// But we can generate and provide our unique id in the inserted document
// const objId = new ObjectId(); // return 12bytes globally uinique identier
// console.log(objId.id) // return Binary data
// console.log(objId.id.length) // return Binary data length ////// 12
// In MongoDb they will store this as Binary data only not the hex string
// to reduce half of the memory
// console.log(objId.toHexString()); /////// 24


const connectToDb = async () => {
    const client = new MongoClient(connectionURL);
    try {
        // Use connect method to connect to mongodb server
      await client.connect();
      console.log("Connected to MongoDB");
      // Use db method to create db with db name
      const db = client.db(dbName);
    //   await insertToDb(db);
    //   await findOperationInDb(db);
    //   await updateInDb(db);
      await deleteInDb(db);
    } catch (error) {
      console.log("some error occured while connecting to db", error);
    } finally {
      client.close();
    }
  };

  async function deleteInDb(db) {
    const deleteOne = async () => {
      const deletedResult = await db
        .collection("users")
        .deleteOne({ name: "Ajit" });
      console.log(deletedResult);
    };
    const deleteMany = async () => {
      const deletedResult = await db
        .collection("tasks")
        .deleteMany({ completed: false });
      console.log(deletedResult);
    };
  
    await deleteOne();
    await deleteMany();
  }
  
  async function updateInDb(db) {
    const updateOne = async () => {
      const updateResult = await db
        .collection("users")
        .updateOne({ name: "Thiru" }, { $set: { name: "Ajit" } });
      //  update one will update the first result it finds and it takes two params one is to determine key and other is update operators
      console.log(updateResult);
    };
    const updateMany = async () => {
      const updateResult = await db
        .collection("tasks")
        .updateMany({ completed: false }, { $set: { incompletedTask: true } });
      //  update one will update the first result it finds and it takes two params one is to determine key and other is update operators
      console.log(updateResult);
    };
  
    const updateWithoutUpdateOperator = async () => {
      const updateResult = await db
        .collection("users")
        .updateOne({ name: "Thiru" }, { completedTask: true, taskName: "New" });
      // it will will throw any error as it required update operator
    };
  
    await updateOne();
    await updateMany();
    // await updateWithoutUpdateOperator();
  }
  
  async function findOperationInDb(db) {
    const findOne = async () => {
      const user = await db.collection("users").findOne({ name: "Thiru" });
      console.log(user);
    };
    const findMany = async () => {
      const userList = await db
        .collection("tasks")
        .find({ completed: false })
        .toArray();
      // .find() will fetch all results and gives us cursor obj
      // cusror obj having many methods like limit, count that we can fetch directly with knowing the whole data.
      // if we try to find document using objid then syantx {_id: new ObjId('randomId')}
      // mongoDb only finds documents using binary id
      console.log(userList);
    };
    await findOne();
    await findMany();
  }
  
  async function insertToDb(db) {
    const inserOne = async () => {
      const record = await db.collection("users").insertOne({
        name: "Thiru",
        age: 26,
      });
      console.log(record);
  
      /*
      // connect to db alternate method
  
      MongoClient.connect(connectionURL)
        .then((client) => {
          console.log("Connected to MongoDB");
          const db = client.db(dbName);
          db.collection("users").insertOne({
            name: "Thiru",
            age: 26,
          });
        })
        .catch((error) => {
          return console.log("some error occured while connecting to db");
        });
  
      */
    };
  
    const insertMany = async () => {
      try {
        const result = await db.collection("tasks").insertMany([
          {
            description: "Clean the house",
            completed: true,
          },
          {
            description: "Renew inspection",
            completed: false,
          },
        ]);
        console.log(result);
      } catch (error) {
        console.log("Unable to insert tasks!", error);
      }
    };
  
    // await inserOne();
    await insertMany();
  }
  
  connectToDb();


  // const cursor = db.collection('users').find().limit(10);
  // const cursor = db.collection('users').find().skip(5);
  // const cursor = db.collection('users').find().sort({ age: 1 });
  // const count = await db.collection('users').find({ age: { $gt: 25 } }).count();
  // const documents = await cursor.toArray();