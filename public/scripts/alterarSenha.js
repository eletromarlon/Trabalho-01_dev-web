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

const mostrarSenha3 = () => {
	let input = document.querySelector("#password3");
	if (input.type === "password") {
		input.type = "text";
		let olho = document.querySelector(".mostrar3");
		olho.classList.add("fa-eye-slash");
		olho.classList.remove("fa-eye");
	} else {
		input.type = "password";
		let olho = document.querySelector(".mostrar3");
		olho.classList.add("fa-eye");
		olho.classList.remove("fa-eye-slash");
	}
};

const confirmarDados = () => {
	let password = document.querySelector("#password");
	let password2 = document.querySelector("#password2");
	let password3 = document.querySelector("#password3");

	if (
		password != "" &&
		password2.value === password3.value &&
		password2.value != "" &&
		password3.value != ""
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
	} else if (password2.value !== password3.value) {
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
