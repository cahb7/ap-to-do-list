const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let todos = [
  { id: 1, titulo: "comprar ração do pitico", concluido: false },
  { id: 2, titulo: "comprar pão", concluido: true },
  { id: 3, titulo: "levar mãe no médico", concluido: false }
];
let nextId = 4;

// rota /todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

//rota de post  /todos 
app.post('/todos', (req, res) => {
  const { titulo, concluido = false } = req.body;

  if (!titulo) {
    return res.status(400).json({ erro: 'O campo "titulo" é obrigatório.' });
  }

  const novoTodo = {
    id: nextId++,
    titulo,
    concluido
  };

  todos.push(novoTodo);
  res.status(201).json(novoTodo);
});

// rota de put /todos/:id 
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, concluido } = req.body;

  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ erro: 'Tem isso não mano' });
  }

  if (titulo !== undefined) todo.titulo = titulo;
  if (concluido !== undefined) todo.concluido = concluido;

  res.json(todo);
});

// rota DELETE /todos/:id 
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
 return res.status(404).json({ erro: 'Tem isso não mano.' });
  }

  const removido = todos.splice(index, 1);
  res.json(removido[0]);
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
