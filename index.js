const express = require('express');
const cors = require('cors');
const pool = require('./database');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('API To-Do List com MariaDB rodando 🚀');
});


app.get('/todos', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM todos');
    conn.release();

    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar tarefas' });
  }
});


app.post('/todos', async (req, res) => {
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

    res.status(201).json({
      id: result.insertId,
      titulo,
      concluido: false
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar tarefa' });
  }
});


app.put('/todos/:id', async (req, res) => {
  const { titulo, concluido } = req.body;
  const id = req.params.id;

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
    res.status(500).json({ erro: 'Erro ao atualizar tarefa' });
  }
});


app.delete('/todos/:id', async (req, res) => {
  const id = req.params.id;

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
    res.status(500).json({ erro: 'Erro ao remover tarefa' });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
