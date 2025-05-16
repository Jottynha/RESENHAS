let usuario = prompt("Digite seu nome de usuário:") || "usuario_padrao";
let resenhas = JSON.parse(localStorage.getItem(`resenhas_${usuario}`)) || [];

const form = document.getElementById("resenha-form");
const container = document.getElementById("resenhas-container");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");
const editarBtn = document.getElementById("editar-btn");
const excluirBtn = document.getElementById("excluir-btn");

let resenhaAtual = null;

// Salva no localStorage
function salvarResenhas() {
  localStorage.setItem(`resenhas_${usuario}`, JSON.stringify(resenhas));
}

// Renderiza blocos de resenhas
function renderizarResenhas() {
  container.innerHTML = "";
  resenhas.forEach((resenha, index) => {
    const div = document.createElement("div");
    div.className = "resenha";
    div.innerHTML = `
      <h3>${resenha.titulo}</h3>
      <p>${resenha.tipo}</p>
      <p class="nota">Nota: ${resenha.nota} ⭐</p>
    `;
    div.addEventListener("click", () => abrirModal(index));
    container.appendChild(div);
  });
}

// Abre o modal com detalhes
function abrirModal(index) {
  resenhaAtual = index;
  const r = resenhas[index];
  modalBody.innerHTML = `
    <h2>${r.titulo}</h2>
    <p><strong>Tipo:</strong> ${r.tipo}</p>
    <p><strong>Nota:</strong> ${r.nota} ⭐</p>
    <p><strong>Tags:</strong> ${r.tags.join(", ")}</p>
    <p><strong>Comentário:</strong> ${r.comentario || "Sem comentário."}</p>
    <div>${r.imagens.map(img => `<img src="${img}" alt="imagem">`).join("")}</div>
  `;
  modal.classList.remove("hidden");
}

// Fecha modal
modalClose.onclick = () => {
  modal.classList.add("hidden");
  resenhaAtual = null;
};

// Excluir
excluirBtn.onclick = () => {
  if (resenhaAtual !== null) {
    resenhas.splice(resenhaAtual, 1);
    salvarResenhas();
    renderizarResenhas();
    modal.classList.add("hidden");
  }
};

// Editar
editarBtn.onclick = () => {
  const r = resenhas[resenhaAtual];
  document.getElementById("titulo").value = r.titulo;
  document.getElementById("tipo").value = r.tipo;
  document.getElementById("nota").value = r.nota;
  document.getElementById("tags").value = r.tags.join(",");
  document.getElementById("comentario").value = r.comentario;
  modal.classList.add("hidden");
  resenhas.splice(resenhaAtual, 1);
  salvarResenhas();
  renderizarResenhas();
};

form.addEventListener("submit", e => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const tipo = document.getElementById("tipo").value;
  const nota = parseFloat(document.getElementById("nota").value);
  const tags = document.getElementById("tags").value.split(",").map(t => t.trim()).filter(t => t);
  const comentario = document.getElementById("comentario").value;
  const imagensInput = document.getElementById("imagens");
  const imagens = [];

  const arquivos = imagensInput.files;
  const readerPromises = [];

  for (let i = 0; i < arquivos.length; i++) {
    const file = arquivos[i];
    const reader = new FileReader();
    readerPromises.push(new Promise((resolve) => {
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    }));
  }

  Promise.all(readerPromises).then(base64Imgs => {
    base64Imgs.forEach(src => imagens.push(src));

    const novaResenha = { titulo, tipo, nota, tags, comentario, imagens };
    resenhas.push(novaResenha);
    salvarResenhas();
    renderizarResenhas();
    form.reset();
  });
});

// Inicialização
renderizarResenhas();
