/* FilePond.registerPlugin(
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
FilePond.create(document.querySelector("#upload"), {
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
*/

FilePond.registerPlugin(
	FilePondPluginImagePreview,
	FilePondPluginImageExifOrientation,
	FilePondPluginFileValidateSize,
	FilePondPluginImageEdit
);

// Select the file input and use
// create() to turn it into a pond

const pond = FilePond.create(document.querySelector("#upload"), {
	labelIdle: `Anexar Foto do Veículo <span class="filepond--label-action">Buscar</span>`,
});

pond.setOptions({
	imageCropAspectRatio: "3:1",
});

document.addEventListener("FilePond:addfile", (e) => {
	const arquivos = pond.getFiles();
	document.querySelector("#foto").value = arquivos[0].file.name;
});
