const express = require('express');
const cors = require('cors');
const pool = require('./database');
const path = require('path');


const app = express();
const port = 3000;

/* ======================
   MIDDLEWARES
====================== */
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Frontend')));

/* ======================
   ROTA RAIZ
====================== */
app.get('/', (req, res) => {
  res.send('API To-Do List com MariaDB rodando 🚀');
});

/* ======================
   GET 
====================== */
app.get('/todos', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM todos');
    conn.release();

    res.json(rows);
  } catch (error) {
    console.error('ERRO NO GET /todos:', error);
    res.status(500).json({ erro: error.message });
  }
});

/* ======================
   POST 
====================== */
app.post('/todos', async (req, res) => {
  console.log('BODY RECEBIDO:', req.body);

  const { titulo } = req.body;

  if (!titulo) {
    return res.status(400).json({ erro: 'O campo "titulo" é obrigatório.' });
  }

  try {
    const conn = await pool.getConnection();

    const result = await conn.query(
      'INSERT INTO todos (titulo) VALUES (?)',
      [titulo]
    );

    conn.release();

    console.log('INSERT OK:', result);

    res.status(201).json({
      id: Number(result.insertId),
      titulo,
      concluido: false
    });
  } catch (error) {
    console.error('ERRO NO INSERT:', error);
    res.status(500).json({
      erro: 'Erro ao criar tarefa',
      detalhe: error.message
    });
  }
});

/* ======================
   PUT 
====================== */
app.put('/todos/:id', async (req, res) => {
  const { titulo, concluido } = req.body;
  const id = Number(req.params.id);

  try {
    const conn = await pool.getConnection();

    const result = await conn.query(
      'UPDATE todos SET titulo = ?, concluido = ? WHERE id = ?',
      [titulo, concluido, id]
    );

    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    res.json({ id, titulo, concluido });
  } catch (error) {
    console.error('ERRO NO PUT:', error);
    res.status(500).json({ erro: error.message });
  }
});

/* ======================
   DELETE 
====================== */
app.delete('/todos/:id', async (req, res) => {
  const id = Number(req.params.id);

  try {
    const conn = await pool.getConnection();

    const result = await conn.query(
      'DELETE FROM todos WHERE id = ?',
      [id]
    );

    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    res.json({ mensagem: 'Tarefa removida com sucesso' });
  } catch (error) {
    console.error('ERRO NO DELETE:', error);
    res.status(500).json({ erro: error.message });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
