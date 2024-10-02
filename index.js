const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
morgan.token("post-data", (req, res) => {
  if (req.method == "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});
app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length]  :response-time ms :post-data "
  )
);
const PORT = process.env.PORT || 3001;

const uuid = () => {
  return Math.floor(Math.random() * 1000000).toString(16);
};

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const PERSON_API_ROUTE = "/api/persons";

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get(PERSON_API_ROUTE, (request, response) => {
  response.send(JSON.stringify(persons));
});
app.get(`${PERSON_API_ROUTE}/:id`, (request, response) => {
  const id = request.params.id;
  const person = persons.filter((p) => p.id === id);
  if (!person) {
    response.status(404).end();
  } else {
    response.send(JSON.stringify(person));
  }
});

app.delete(`${PERSON_API_ROUTE}/:id`, (request, response) => {
  const id = request.params.id;
  removedPerson = persons.filter((p) => p.id === id)[0];
  console.log(`removed persond: ${JSON.stringify(removedPerson)}`);

  persons = persons.filter((p) => p.id !== id);
  response.status(200).send(removedPerson);
});

app.get("/info", (request, response) => {
  const msg = `<h1>Phonebook has info for ${
    persons.length
  } people</h1><br></br<h1>${Date()}`;
  response.send(msg);
});

app.post(PERSON_API_ROUTE, (request, resopnse) => {
  const person = request.body;
  if (!person.number) {
    resopnse.status(422).send({ error: "No number given" });
    return;
  }
  if (persons.find((p) => p.name === person.name)) {
    resopnse
      .status(409)
      .send({ error: `${person.name} is already in the phonebook` });
    return;
  }
  persons = persons.concat({
    id: uuid(),
    ...person,
  });
  console.log(persons);
  resopnse.json(person);
});
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
