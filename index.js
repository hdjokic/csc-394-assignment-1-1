const express = require('express')
const app = express()
const port = process.env.PORT || 5000
//Database
const Pool = require('pg').Pool
const connectionParams = process.env.DATABASE_URL || {
	user: 'api_user',
	host: 'localhost',
	database: 'api',
	password: 'password',
	port: 5432
}

const pool = new Pool({
	user: 'api_user',
	host: process.env.DATABASE_URL || 'localhost',
	database: 'api',
	password: 'password',
	port: 5432
	})
	
	
	

app.get('/', (req, res) => {
	console.log('Accept: ' + req.get('Accept'))
	pool.query('SELECT VERSION()', (err, result)=>{
		console.log(err, result.rows)
		res.send('<h1>DB Version: ${result.rows[0].version} </h1>')
		console.log('Content-type' + res.get('Content-Type'))
	})
})

app.listen(port, () => {
	console.log('Example app listening on port ${port}')
})