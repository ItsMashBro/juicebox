const { client } = require("./index.js");

async function testDB() {
    try{
        
        // const result = await client.query('SELECT * FROM users;')
        const users = await getAllUsers()
        //console.log(result)
        console.log(users)
        const updateUserResult = await updateUser(users[0].id, {
            name: "Newname Sogood",
            location: "Lesterville, KY"
        });
        console.log(updateUserResult)
    }catch(error){
        console.log(error)
    }
}

async function getAllUsers(){
    const { rows } = await client.query(`
        SELECT id, username
        FROM users;
    `)
    return rows
}

async function dropTables(){
    try {
        await client.query(
            `DROP TABLE IF EXISTS users;`
        )
    } catch (error) {
        console.log(error)
    }
}


async function createTables(){
    try {
        await client.query(`
            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                active BOOLEAN DEFAULT true
            );
        `)
    } catch (error) {
        console.log(error)
    }
}

async function updateUser(id, fields = {}){
    const setString = Object.keys(fields).map((key, index) => {
        return `"${key}" =$${ index + 1}`
    }).join(', ')

    if (setString.length === 0){
        return;
    }
    try {
        const result = await client.query(`
            UPDATE users
            SET ${ setString }
            WHERE id = ${ id }
            RETURNING *;
        `, Object.values(fields))
        return result
    } catch (error) {
        console.log(error)
    }
}



async function rebuildDB(){
    try {
        client.connect()
        await dropTables()
        await createTables()
        await createUsers({username: "jimbo", password: "shlama", name: "JimBob", location: "cowlifornia"})
        await createUsers({username: "Han", password: "Solo", name: "han", location: "cowlifornia"})
        await createUsers({username: "Chew", password: "Bacca", name: "Chewy", location: "cowlifornia"})
        
        await testDB()
        client.end()
    } catch (error) {
        console.log(error)
    }
}

async function createUsers({ username, password, name, location }){
    try {
        client.query(`
            INSERT INTO users(username, password, name, location)
            VALUES ($1, $2, $3, $4);

        `,[ username, password, name, location ])
    } catch (error) {
        console.log(error)
    }
}
async function createPost(){
    try {
        client.query(`
            CREATE TABLE posts(
                id SERIAL PRIMARY KEY,
                "authorID" INTEGER REFERENCES users(id) NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                active BOOLEAN DEFAULT true
            )
        `)
    } catch (error) {
        console.log(error)
    }
}




rebuildDB()