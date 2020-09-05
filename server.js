
const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const userRouter = require("./routers/user-router")

// const session = require("express-session")
// const KnexSessionStore = require("connect-session-knex")(session)

const server = express()

server.use(helmet())
server.use(cors())
server.use(express.json())
// server.use(session({
// 	resave: false, // avoid creating sessions that have no changed
// 	saveUninitialized: false, // to comply with GDPR laws
// 	secret: "Keep it secret, keep it safe", // ccryptographically sign the cookie
// 	store: new KnexSessionStore({ 
// 		knex: db,
// 		createtable: true,
// 	}) // stores cookie sessions to database to persist vs just being in memory
// }))
server.use(cookieParser())

server.use('/api/', userRouter);

server.use((err, req, res, next) => {
	console.log(err)
	
	res.status(500).json({
		message: "Something went wrong",
	})
})

module.exports = server; 