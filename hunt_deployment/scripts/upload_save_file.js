let upload_save_button = document.querySelector("[jigsaw-element='load_game_button']");
upload_save_button.onclick = upload_save;
let file_upload = document.querySelector("[jigsaw-element='load_game_file']");

function upload_save() {
    localStorage.clear();
    let file = file_upload.files[0];

    const reader = new FileReader();
    reader.readAsText(file);

    reader.addEventListener("load", () => {
        let local_storage_obj = JSON.parse(reader.result);

        for (let i = 0; i < Object.keys(local_storage_obj).length; i++) {
            localStorage[Object.keys(local_storage_obj)[i]] = local_storage_obj[Object.keys(local_storage_obj)[i]];
        }
      }, false);
}