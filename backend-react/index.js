
// const express = require('express');
// const bodyParser = require('body-parser');
// const { MongoClient} = require('mongodb');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(bodyParser.json());


// const dbName = 'mydatabase';
// const url = `mongodb://localhost:27017/${dbName}`;

// const client = new MongoClient(url);

// try {
//    client.connect();
//   console.log('Connected to MongoDB');
// } catch (err) {
//   console.error('Error connecting to MongoDB:', err);
//   process.exit(1);
// }

// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization;
  
//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized: No token provided' }); // Adjusted error message
//   }
//   jwt.verify(token.split(' ')[1], 'secret_key', (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Unauthorized: Invalid token' }); // Adjusted error message
//     }
//     const extractedToken = parts[1];
//   console.log('Extracted Token:', extractedToken);
//     req.user = decoded;
//     next();
//   });
// };

// app.use(verifyToken);


// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   console.log(username);
//   console.log(password);
//   try {
//     const db = client.db(dbName);
//     const users = db.collection('data');
//     const user = await users.findOne({ username, password });
//     if (user) {
//       const token = jwt.sign({ username }, 'secret_key');
//       res.json({ token });
//     } else {
//       res.status(401).json({ message: 'Invalid username or password' }); // Adjusted error message
//     }
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });


// app.get('/api/data', async (req, res) => {
//   try {
//     const { username } = req.user;

//     const db = client.db(dbName);
//     const certificates = db.collection('data'); 
//     console.log(username)

//     const userCertificates = await certificates.find({ username }).toArray();
//     console.log(userCertificates)
//     res.json(userCertificates);
//   } catch (err) {
//     console.error('Error querying the database:', err); // Handle database query errors
//     res.status(500).json({ message: 'Database Error' });
//   }
// });


// app.listen(port, () => console.log(`Server running on port ${port}`));







const express = require('express')
var bodyParser = require('body-parser')
const cors = require('cors')
var jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 5000;

const { MongoClient} = require('mongodb');

const dbName = 'mydatabase';
const uri = `mongodb://localhost:27017/${dbName}`;
const client = new MongoClient(uri);

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
	console.log('Global middleware');
	next();
})

function middleware(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), 'MMEAC@22');
      req.user = decoded; // Attach user information to request
      next();
  } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
  }
}


app.post('/login', async (req, res) => {
  let inputData = req.body;
  try {
      // Query MongoDB to check if credentials are valid
      const user = await getUserFromDB(inputData.username, inputData.password);
      if (!user) {
          return res.status(401).send('Username or password doesn\'t match');
      }

      // Generate JWT token
      const token = jwt.sign({ username: user.username, id: user._id }, 'MMEAC@22');

      res.json({ token: token });
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to query MongoDB for user
async function getUserFromDB(username, password) {
  const db = client.db(dbName);
  const users = db.collection('data');
  return await users.findOne({ username, password });
}



app.get('/api/data',middleware, async (req, res) => {
  try {
    const { username } = req.user;

    const db = client.db(dbName);
    const certificates = db.collection('data'); 
    console.log(username)

    const userCertificates = await certificates.find({ username }).toArray();
    console.log(userCertificates)
    res.json(userCertificates);
  } catch (err) {
    console.error('Error querying the database:', err); // Handle database query errors
    res.status(500).json({ message: 'Database Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})