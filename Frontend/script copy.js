console.log('SCRIPT CARREGADO');

/* ======================
   ELEMENTOS
====================== */
const API = '/todos';
const lista = document.getElementById('lista');
const input = document.getElementById('titulo');
const btnAdicionar = document.getElementById('btnAdicionar');
const btnTheme = document.getElementById('toggleTheme');

/* ======================
   LISTAR TODOS
====================== */
async function carregarTodos() {
  const res = await fetch(API);
  const todos = await res.json();

  lista.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item';

    const left = document.createElement('div');
    left.className = 'todo-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.concluido;
    checkbox.addEventListener('change', () => toggleConcluido(todo));

    const span = document.createElement('span');
    span.textContent = todo.titulo;
    if (todo.concluido) span.classList.add('concluido');

    left.appendChild(checkbox);
    left.appendChild(span);

    const btnDelete = document.createElement('button');
    btnDelete.className = 'delete-btn';
    btnDelete.textContent = '🗑';
    btnDelete.addEventListener('click', () => deletarTodo(todo.id));

    li.appendChild(left);
    li.appendChild(btnDelete);

    lista.appendChild(li);
  });
}

/* ======================
   CRIAR TODO
====================== */
async function criarTodo() {
  const titulo = input.value.trim();
  if (!titulo) return;

  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo })
  });

  input.value = '';
  carregarTodos();
}

/* ======================
   TOGGLE CONCLUÍDO
====================== */
async function toggleConcluido(todo) {
  await fetch(`${API}/${todo.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titulo: todo.titulo,
      concluido: !todo.concluido
    })
  });

  carregarTodos();
}

/* ======================
   DELETAR
====================== */
async function deletarTodo(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  carregarTodos();
}

/* ======================
   DARK MODE
====================== */
const isDark = localStorage.getItem('theme') === 'dark';

if (isDark) {
  document.body.classList.add('dark');
  btnTheme.textContent = '☀️';
}

btnTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const ativo = document.body.classList.contains('dark');
  localStorage.setItem('theme', ativo ? 'dark' : 'light');
  btnTheme.textContent = ativo ? '☀️' : '🌙';
});


btnAdicionar.addEventListener('click', criarTodo);


carregarTodos();
