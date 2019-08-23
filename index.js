require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
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

const PORT = process.env.PORT

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

app.post("/api/persons", (req, res) => {
    p = req.body
    if (p.name === undefined || p.number === undefined) {
        res.status(400).json({error: "Name and number fields are required!"});
    }

    const person = new Person({
        name: p.name,
        number: p.number
    });
    person.save().then(nPerson => {
        res.json(nPerson.toJSON());
    });
});

app.get("/api/persons/:id", (req, res) => {
    Person.findById(req.params.id).then(person => {
        response.json(person.toJSON());
    });
});

app.get("/info", (req, res) => {
    people.find({}).then(result => {
        res.send(`<p>Puhelinluettelossa on ${result.length} henkilön tiedot</p><p>${Date().toString()}</p>`);
    })
});

app.get("/api/persons", (_, res) => {
    Person.find({}).then(result => {
        res.json(result.map(p => p.toJSON()));
    });
});

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`)
})