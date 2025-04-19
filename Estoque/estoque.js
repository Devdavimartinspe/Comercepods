const formulario = document.getElementById('formulario');
const listaProdutos = document.getElementById('lista-produtos');
const nomeInput = document.getElementById('nome');
const descricaoInput = document.getElementById('descricao');
const precoInput = document.getElementById('preco');
const imagemInput = document.getElementById('imagem');
const quantidadeInput = document.getElementById('quantidade');
const editandoIndice = document.getElementById('editandoIndice');

function carregarProdutos() {
  const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  listaProdutos.innerHTML = '';

  produtos.forEach((produto, index) => {
    const div = document.createElement('div');
    div.className = 'produto';
    div.innerHTML = `
      <strong>${produto.nome}</strong><br>
      <img src="${produto.imagem}" alt="${produto.nome}"><br>
      ${produto.descricao}<br>
      <strong>R$ ${produto.preco.toFixed(2)}</strong><br>
      Quantidade: ${produto.quantidade}
      <div class="produto-actions">
        <button onclick="editarProduto(${index})">Editar</button>
        <button class="remover" onclick="removerProduto(${index})">Remover</button>
      </div>
    `;
    listaProdutos.appendChild(div);
  });
}

function salvarProduto(event) {
  event.preventDefault();
  const nome = nomeInput.value.trim();
  const descricao = descricaoInput.value.trim();
  const preco = parseFloat(precoInput.value);
  const imagem = imagemInput.value.trim();
  const quantidade = parseInt(quantidadeInput.value);
  const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

  const novoProduto = { nome, descricao, preco, imagem, quantidade };

  const indice = editandoIndice.value;
  if (indice === '') {
    produtos.push(novoProduto);
  } else {
    produtos[indice] = novoProduto;
  }

  localStorage.setItem('produtos', JSON.stringify(produtos));
  formulario.reset();
  editandoIndice.value = '';
  carregarProdutos();
}

function editarProduto(index) {
  const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  const produto = produtos[index];
  nomeInput.value = produto.nome;
  descricaoInput.value = produto.descricao;
  precoInput.value = produto.preco;
  imagemInput.value = produto.imagem;
  quantidadeInput.value = produto.quantidade;
  editandoIndice.value = index;
}

function removerProduto(index) {
  const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  produtos.splice(index, 1);
  localStorage.setItem('produtos', JSON.stringify(produtos));
  carregarProdutos();
}

formulario.addEventListener('submit', salvarProduto);
window.addEventListener('load', carregarProdutos);
