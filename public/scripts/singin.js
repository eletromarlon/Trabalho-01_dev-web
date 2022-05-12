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
