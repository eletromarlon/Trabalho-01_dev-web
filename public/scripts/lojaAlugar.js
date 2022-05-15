let data = new Date();
let ano = data.getFullYear();
let mes = data.getMonth() + 1;

if (mes < 10) {
	mes = "0" + mes;
}
let dia = data.getDate();

let datas = document.querySelectorAll(".data");
datas[0].setAttribute("min", `${ano}-${mes}-${dia}`);

let dataini = document.querySelector("#dataini");
let datafim = document.querySelector("#datafim");
datafim.setAttribute("disabled", "disabled");

dataini.addEventListener("change", () => {
	datafim.removeAttribute("disabled");
	datafim.setAttribute("min", dataini.value);
});

let valor = document.querySelector(".valor");
let valor1 = document.querySelector("#valor");
let pagamentos = document.querySelector(".pagamentos");
valor.style.display = "none";
pagamentos.style.display = "none";

datafim.addEventListener("change", () => {
	valor.style.display = "block";
	pagamentos.style.display = "block";
});

const pagamento = () => {
	let forma = document.querySelectorAll(".forma");
	let pix = document.querySelector("#pagamento-pix");
	let boleto = document.querySelector("#pagamento-boleto");
	let cartao = document.querySelector("#pagamento-cartao");
	if (pix.checked) {
		forma[0].classList.add("selecionado");
		forma[1].classList.remove("selecionado");
		forma[2].classList.remove("selecionado");
	} else if (boleto.checked) {
		forma[1].classList.add("selecionado");
		forma[0].classList.remove("selecionado");
		forma[2].classList.remove("selecionado");
	} else {
		forma[0].classList.remove("selecionado");
		forma[1].classList.remove("selecionado");
		forma[2].classList.add("selecionado");
	}
};
