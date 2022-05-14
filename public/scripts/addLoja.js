FilePond.registerPlugin(
	FilePondPluginFileValidateType,
	FilePondPluginImageExifOrientation,
	FilePondPluginImagePreview,
	FilePondPluginImageCrop,
	FilePondPluginImageResize,
	FilePondPluginImageTransform,
	FilePondPluginImageEdit
);

// Select the file input and use
// create() to turn it into a pond
FilePond.create(document.querySelector("input[type=file]"), {
	labelIdle: `Anexar Foto do Veículo <span class="filepond--label-action">Buscar</span>`,
	imagePreviewHeight: 100,
	imageCropAspectRatio: "3:1",
	imageResizeTargetWidth: 100,
	imageResizeTargetHeight: 100,
	stylePanelLayout: "compact",
	styleLoadIndicatorPosition: "center bottom",
	styleProgressIndicatorPosition: "right bottom",
	styleButtonRemoveItemPosition: "left bottom",
	styleButtonProcessItemPosition: "right bottom",
});

document.querySelector("#upload").addEventListener("change", (event) => {
	let reader = new FileReader();
	let file = event.target.files[0];
	reader.readAsDataURL(file);
	reader.onloadend = () => {
		document.querySelector(".foto").value = reader.result;
	};
});
