import http from 'http'
import express from 'express'
import path from 'path'

const app = express();
const server = http.createServer(app);

app.use(express.static(path.resolve('./public')))

server.listen(3000, () => console.log('HTTP Server is running on port 3000'))


