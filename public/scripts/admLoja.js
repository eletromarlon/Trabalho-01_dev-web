const deletar = document.querySelectorAll(".delete");

for (let i = 0; i < deletar.length; i++) {
	deletar[i].addEventListener("click", function (e) {
		e.preventDefault();
		let id = e.target.id;
		Swal.fire({
			title: "Você tem certeza?",
			text: `Você não poderá reverter isso!`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Sim, excluir!",
			cancelButtonText: "Cancelar",
		}).then((result) => {
			if (result.value) {
				window.location.href = `/veiculoDeletado?excluir=${id}`;
			}
		});
	});
}
