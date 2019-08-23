require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

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
    Person.findByIdAndRemove(req.params.id).then(result => {
        res.status(204).end()
    }).catch(error => next(error));
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
    }).catch(error => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person.toJSON());
        } else {
            res.status(404).end();
        }
    }).catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;
    
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updated => {
            res.json(updated.toJSON());
        }).catch(error => next(error));
});

app.get("/info", (req, res) => {
    Person.find({}).then(result => {
        res.send(`<p>Puhelinluettelossa on ${result.length} henkilön tiedot</p><p>${Date().toString()}</p>`);
    }).catch(error => next(error));
});

app.get("/api/persons", (_, res) => {
    Person.find({}).then(result => {
        res.json(result.map(p => p.toJSON()));
    }).catch(error => next(error));
});

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message);
  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' });
    } 
    next(error);
}

app.use(errorHandler);