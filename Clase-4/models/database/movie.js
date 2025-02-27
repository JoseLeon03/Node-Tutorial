import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'

const uri = 'mongodb://joseleon:<db_password>@<hostname>/?ssl=true&replicaSet=atlas-rt6dog-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0'

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function connect () {
  try {
    await client.connect()
    const database = client.db('database')
    return database.collection('movies')
  } catch (err) {
    console.error(err)
    await client.close()
  }
}

export class MovieModel {
  static async getAll ({ genre }) {
    const db = await connect()
    if (genre) {
      return db.find({
        genre: {
          $elemMatch: {
            $regex: genre,
            $options: 'i'
          }
        }
      }).toArray()
    }
    return db.find({}).toArray()
  }

  static async getById ({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id)
    return db.findOne({ _id: objectId })
  }

  static async delete ({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id)
    const { deletedCount } = await db.deleteOne({ _id: objectId })
    return deletedCount > 0
  }
}
