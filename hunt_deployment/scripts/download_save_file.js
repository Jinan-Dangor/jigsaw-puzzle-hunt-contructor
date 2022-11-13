var puzzle_data = JSON.parse(localStorage.getItem("puzzle_data"));

let download_save_button = document.querySelector("[jigsaw-element='save_game_button']");
download_save_button.onclick = download_save;

function download_save() {
    let filename = puzzle_data.hunt_settings.hunt_name + ".sav";
    let text = JSON.stringify(localStorage);
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}