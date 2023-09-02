const http = require('http')

const PORT = 5000

const todos = [ 
  {id: 1, text: 'todo one'},
  {id: 2, text: 'todo two'},
  {id: 3, text: 'todo three'}
]

const server = http.createServer((req,res) => {
  const { method, url } = req

  let body = []

  req.on('data', chunk => {
    body.push(chunk)
  })
  .on('end', () => {
    body = Buffer.concat(body).toString()

    let status = 404
    const response = {
      success: false,
      data: null
    }

    if (method === 'GET' && url === '/todos') {
      status = 200
      response.success = true
      response.data = todos
    } else if (method === 'POST' && url === '/todos') {
      const { id, text } = JSON.parse(body)

      if (!id || !text) {
        status = 400
        console.log('missing params')
      } else {
        todos.push({ id, text })
        status = 201
        response.success = true
        response.data = todos
      }
    } 

    res.writeHead(status, {
      'Content-Type': 'application/json',
      'X-Powered-By': 'Node.Js'
    })

    res.end(
      JSON.stringify({
        response
      })
    )

  })

  console.log(req.headers.authorization)


})

server.listen(PORT, () => console.log(`server running on port ${PORT}`))