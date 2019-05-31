const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()

app.use(bodyParser.json())
app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-', 
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(" ")
}))

const PORT = 3001

let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Martti Tienari",
      number: "040-123456",
      id: 2
    },
    {
      name: "Arto Järvinen",
      number: "040-123456",
      id: 3
    },
    {
      name: "Lea Kutvonen",
      number: "040-123456",
      id: 4
    }
]

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

app.post("/api/persons", (req, res) => {
    p = req.body
    const id = Math.floor(Math.random() * 10000000)
    if (p.name && p.number) {
        if (persons.find(pe => pe.name === p.name)) {
            return res.status(400).json({error: "Name must be unique!"})
        }
        p = {
            name: p.name,
            number: p.number,
            id: id
        }
        persons = persons.concat(p)
        return res.json(p)
    }
    res.status(400).json({error: "Name and number fields are required!"})
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    p = persons.find(p => p.id === id)
    if (p) {
        res.json(p)
    }
    else {
        res.status(404).json({error: "No such person!"})
    }
})

app.get("/info", (req, res) => {
    res.send(`<p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p><p>${Date().toString()}</p>`)
})

app.get("/api/persons", (_, res) => {
    res.json(persons)
})

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`)
})