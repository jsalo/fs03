// full stack 2022 osan harjoitukset

const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      },
      {
        "name": "Jouni Salo",
        "number": "123",
        "id": 5
      }
    ]


morgan.token('bodyToken', function (request) {
    //console.log('morgan token for body', request.body)
    return JSON.stringify(request.body)
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :bodyToken"))

const generateId = () => {
    return Math.floor(Math.random() * 100000000);
}

app.get('/', (request, response) => {
  res.send('<h1>Phonebook API is here</h1>')
})

app.get('/info', (request, response) => {
    const currentTime = new Date().toString()
    response.send(`<h1>Phonebook has ${persons.length} people</h1><div>${currentTime}</div>`)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log('POST /api/persons', request.body)

    if (!request.body) {
        console.log('400 no content')
        return response.status(400).json({ 
            error: 'content missing' 
        })
    }
    if (typeof body.name == 'undefined') {
        console.log('400 missing name')
        return response.status(400).json({ 
            error: 'missing name' 
        }) 
    }
    if (body.name.length < 3) {
        console.log('400 bad name')
        return response.status(400).json({ 
            error: 'bad name' 
        }) 
    }
    if ( typeof body.number == 'undefined') {
        console.log('400 bad number')
        return response.status(400).json({ 
            error: 'missing number' 
        }) 
    }
    if (body.number.length < 3) {
        console.log('400 bad number')
        return response.status(400).json({ 
            error: 'bad number' 
        })
    }
    foundPerson = persons.filter(p => p.name.toLowerCase() === body.name.toLowerCase())
    if (foundPerson.length > 0) {
        console.log('400 already exists')
        return response.status(400).json({ 
            error: 'person has already been added' 
        }) 
    } 

    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
    persons = persons.concat(person)
    console.log('response:', person)
    response.json(person)
})

app.get('/api/persons/', (request, response) => {
    console.log('GET /api/persons/', persons)
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('GET /api/persons/', id)
    const person = persons.find(p => p.id === id)
    if (person) {
        console.log('response:', person)
        response.json(person)
    } else {
        console.log('404')
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('DELETE /api/persons/', id)
    person = persons.filter(p => p.id === id)

    if (person.length) {
        console.log('204')
        response.status(204).end()
    } else {
        console.log('404')
        response.status(404).end()
    }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})