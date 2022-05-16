const sexo = () => {
	let genero = document.querySelectorAll(".sexo");
	let feminino = document.querySelector("#feminino");
	let masculino = document.querySelector("#masculino");
	if (feminino.checked) {
		genero[1].classList.add("selecionado");
		genero[0].classList.remove("selecionado");
	} else if (masculino.checked) {
		genero[0].classList.add("selecionado");
		genero[1].classList.remove("selecionado");
	} else {
		genero[0].classList.remove("selecionado");
		genero[1].classList.remove("selecionado");
	}
};

const tel = document.getElementById("telefone"); // Seletor do campo de telefone

tel.addEventListener("keypress", (e) => mascaraTelefone(e.target.value)); // Dispara quando digitado no campo
tel.addEventListener("change", (e) => mascaraTelefone(e.target.value)); // Dispara quando autocompletado o campo

const mascaraTelefone = (valor) => {
	valor = valor.replace(/\D/g, "");
	valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
	valor = valor.replace(/(\d)(\d{4})$/, "$1-$2");
	tel.value = valor; // Insere o(s) valor(es) no campo
};

let data = new Date();
let ano = data.getFullYear() - 18;
let mes = data.getMonth() + 1;

if (mes < 10) {
	mes = "0" + mes;
}
let dia = data.getDate();

let maioridade = document.querySelector("#nascimento");
maioridade.setAttribute("max", `${ano}-${mes}-${dia}`);
