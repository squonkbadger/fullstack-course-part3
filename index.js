const express = require('express')
const morgan = require('morgan')

const app = express()


app.use(express.json())

morgan.token('body', function getBody(req) {
  return JSON.stringify(req.body)
})


app.use(morgan(':method :url :response-time :body'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "123",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "456"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "789"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "987"
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const amount = persons.length
  const date = new Date
  response.send('Phonebook has info for ' + amount + ' people.<br />'+date)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request,response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const id = Math.floor(Math.random() * 100)
  return id
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name already exists'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)