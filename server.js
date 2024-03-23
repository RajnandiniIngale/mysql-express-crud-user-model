const express = require('express');
const mysql = require('mysql2');


//This code uses the `mysql.createConnection()` function to establish a connection to the database. 
const connection = mysql.createConnection({
    host: '172.17.0.2',
    user: 'root',
    password: 'Rajnandini22',
    database: 'mysql_demo'
})

connection.connect((error) => {
    if (error) {
        console.error(error);
    }
    else {
        console.log('Connected to database')
    }
});

const app = express();

app.use(express.json());


app.get("/users", (req, res) => {
    connection.query('select * from users', (error, data) => {
        if (error) {
            console.error(error);

            res.status(500).json({ message: 'Error retrieving users' })
        }
        res.status(200).json({ data });
    })
});

app.post("/users", (req, res) => {
    const { name, email } = req.body;

    connection.query('insert into users (name,email) values (?,?)', [name, email], (error) => {

        if (error) {
            console.error(error);

            res.status(500).json({ message: 'Error creating user' })
        }
        else {
            res.json({ message: "User created successfully!" })
        }

    })
});


app.put("/user/:id", (req, res) => {
    const id = req.params.id;
    const { name, email } = req.body;

    connection.query('update users set name=?,email=? where id=?', [name, email, id], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating user!' })
        }
        else {

            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'User not found!' });
            }
            else{
                res.json({ message: 'User updated successfully!' });
            }
        }
    })

});

app.delete("/user/:id", (req, res) => {
    const id  = req.params.id;

    connection.query('delete from users where id = ?', [id], (error, result) => {
        if (error) {
            console.error(error);

            res.status(500).json({ message: 'Error deleting user!' })
        }
        else {

            if (result.affectedRows == 0) {
                res.status(404).json({ message: "User not found!" })
            }
            else {
                res.json({ message: "User deleted successfully" })
            }
        }
    })
})



const port = 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})