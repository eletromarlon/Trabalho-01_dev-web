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
	valor.style.display = "flex";
	pagamentos.style.display = "block";

	let data1 = dataini.value.split("-");
	let data2 = datafim.value.split("-");
	let mes = [];
	let ano1 = parseInt(data1[0]);
	let ano2 = parseInt(data2[0]);
	let mes1 = parseInt(data1[1]);
	let mes2 = parseInt(data2[1]);
	let dia1 = parseInt(data1[2]);
	let dia2 = parseInt(data2[2]);
	if (ano1 % 4 == 0 && (ano1 % 100 != 0 || ano1 % 400 == 0)) {
		ano1 *= 366;
		mes = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		mes1 = mes[mes1 - 1];
	} else if (ano2 % 4 == 0 && (ano2 % 100 != 0 || ano2 % 400 == 0)) {
		ano2 *= 366;
		mes = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		mes2 = mes[mes2 - 1];
	} else {
		ano1 = parseInt(data1[0] * 365);
		ano2 = parseInt(data2[0] * 365);
		mes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		mes1 = mes[mes1 - 1];
		mes2 = mes[mes2 - 1];
	}
	let diferenca = ano2 + mes2 + dia2 - ano1 - mes1 - dia1 + 1;
	let diaria = parseFloat(document.querySelector("#diaria").value);
	document.querySelector("#valor").value = diferenca * diaria;
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
	} else if (cartao.checked) {
		forma[0].classList.remove("selecionado");
		forma[1].classList.remove("selecionado");
		forma[2].classList.add("selecionado");
	} else {
		forma[0].classList.remove("selecionado");
		forma[1].classList.remove("selecionado");
		forma[2].classList.remove("selecionado");
	}
};
