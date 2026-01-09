console.log('SCRIPT CARREGADO');

const API = '/todos';
const lista = document.getElementById('lista');

/* ======================
   LISTAR TODOS
====================== */
async function carregarTodos() {
  const res = await fetch(API);
  const todos = await res.json();

  lista.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');

    const todoDiv = document.createElement('div');
    todoDiv.className = 'todo';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.concluido;
    checkbox.onchange = () => toggleConcluido(todo);

    const span = document.createElement('span');
    span.textContent = todo.titulo;
    if (todo.concluido) span.classList.add('concluido');

    todoDiv.appendChild(checkbox);
    todoDiv.appendChild(span);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const btnDelete = document.createElement('button');
    btnDelete.textContent = '🗑';
    btnDelete.onclick = () => deletarTodo(todo.id);

    actions.appendChild(btnDelete);

    li.appendChild(todoDiv);
    li.appendChild(actions);

    lista.appendChild(li);
  });
}

/* ======================
   CRIAR TODO
====================== */
async function criarTodo() {
  const input = document.getElementById('titulo');
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
   MARCAR / DESMARCAR
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
  await fetch(`${API}/${id}`, {
    method: 'DELETE'
  });

  carregarTodos();
}

/* ======================
   EXPOE FUNÇÕES GLOBAIS
====================== */
window.criarTodo = criarTodo;

/* ======================
   INICIALIZA
====================== */
carregarTodos();
