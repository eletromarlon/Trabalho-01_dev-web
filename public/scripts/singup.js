let genero = document.querySelectorAll(".sexo");
let feminino = document.querySelector("#feminino");
let masculino = document.querySelector("#masculino");
const sexo = () => {
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

const proxima = () => {
	let nome = document.querySelector("#name");
	let nascimento = document.querySelector("#nascimento");
	let telefone = document.querySelector("#telefone");
	let feminino = document.querySelector("#feminino");
	let masculino = document.querySelector("#masculino");

	if (
		nome.value != "" &&
		nascimento.value != "" &&
		telefone.value != "" &&
		(feminino.checked || masculino.checked)
	) {
		document.querySelector(".pessoais").style.display = "none";
		document.querySelector(".confirmar").style.display = "block";
		document.querySelector(".valor1").style.backgroundColor = "#f54a48";
		document.querySelector(".valor1").style.color = "#fff";
		return true;
	}
};

const mostrarSenha = () => {
	let input = document.querySelector("#password");
	if (input.type === "password") {
		input.type = "text";
		let olho = document.querySelector(".fa-eye");
		olho.classList.add("fa-eye-slash");
		olho.classList.remove("fa-eye");
	} else {
		input.type = "password";
		let olho = document.querySelector(".fa-eye-slash");
		olho.classList.add("fa-eye");
		olho.classList.remove("fa-eye-slash");
	}
};

const mostrarSenha2 = () => {
	let input = document.querySelector("#password2");
	if (input.type === "password") {
		input.type = "text";
		let olho = document.querySelector(".mostrar2");
		olho.classList.add("fa-eye-slash");
		olho.classList.remove("fa-eye");
	} else {
		input.type = "password";
		let olho = document.querySelector(".mostrar2");
		olho.classList.add("fa-eye");
		olho.classList.remove("fa-eye-slash");
	}
};

const voltar = () => {
	document.querySelector(".pessoais").style.display = "block";
	document.querySelector(".confirmar").style.display = "none";
};
const confirmarDados = () => {
	let email = document.querySelector("#email");
	let password = document.querySelector("#password");
	let password2 = document.querySelector("#password2");
	let dadosPessoais = proxima();

	if (
		dadosPessoais &&
		password.value === password2.value &&
		password.value != "" &&
		password2.value != "" &&
		email.value.indexOf("@") > -1
	) {
		const Toast = Swal.mixin({
			toast: true,
			position: "top-end",
			showConfirmButton: false,
			timer: 3000,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener("mouseenter", Swal.stopTimer);
				toast.addEventListener("mouseleave", Swal.resumeTimer);
			},
		});

		Toast.fire({
			icon: "success",
			title: "Cadastro com Sucesso",
		});
	} else if (password.value !== password2.value) {
		const Toast = Swal.mixin({
			toast: true,
			position: "top-end",
			showConfirmButton: false,
			timer: 3000,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener("mouseenter", Swal.stopTimer);
				toast.addEventListener("mouseleave", Swal.resumeTimer);
			},
		});

		Toast.fire({
			icon: "warning",
			title: "Senhas Diferentes!",
		});
	} else {
		const Toast = Swal.mixin({
			toast: true,
			position: "top-end",
			showConfirmButton: false,
			timer: 3000,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener("mouseenter", Swal.stopTimer);
				toast.addEventListener("mouseleave", Swal.resumeTimer);
			},
		});

		Toast.fire({
			icon: "error",
			title: "Não foi possível realizar o cadastro!",
		});
	}
};
