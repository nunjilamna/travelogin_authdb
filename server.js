const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurasi koneksi MySQL
const connection = mysql.createConnection({
  host: '34.101.132.147',
  user: 'travetips',
  password: 'travetips', 
  database: 'tiptips'
});

// Membuka koneksi MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    console.log("Response success")
    res.send("Response Success!")
})

app.get('/users', function (req, res) {
    const queryStr = 'SELECT * FROM users';
    connection.query(queryStr, (err, results) => {
        if(err){
            console.log(err);
            res.status(500).send("Terjadi kesalahan dalam mengambil data.");
        }else{
            res.send(results);
            console.log(results);
        }
    })
})

// Endpoint untuk registrasi
app.post('/register', (req, res) => {
  const { id, first_name, last_name, email, password } = req.body;

  // Mengecek apakah username sudah terdaftar
  const checkQuery = `SELECT * FROM users WHERE email = '${email}'`;
  connection.query(checkQuery, (err, result) => {
    if (err) {
      console.error('Error checking email : ', err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      if (result.length > 0) {
        res.status(409).json({ message: 'Username already exists' });
      } else {
        // Menambahkan user baru ke database
        const insertQuery = `INSERT INTO users (id, first_name, last_name, email, password) VALUES ('${id}', '${first_name}', '${last_name}', '${email}', '${password}')`;
        connection.query(insertQuery, (err, result) => {
          if (err) {
            console.error('Error registering user: ', err);
            res.status(500).json({ message: 'Internal server error' });
          } else {
            res.status(200).json({ message: 'Registration successful' });
          }
        });
      }
    }
  });
});

// Endpoint untuk login
app.get('/login', (req, res) => {
    const { email, password } = req.body;
  
    // Mengecek username dan password pada database
    const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
    connection.query(query, (err, result) => {
      if (err) {
        console.error('Error logging in user: ', err);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        if (result.length > 0) {
          res.status(200).json({ message: 'Login successful' });
        } else {
          res.status(401).json({ message: 'Invalid username or password' });
        }
      }
    });
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
