
localStorage.setItem("puzzles_solved", 0);

let clear_storage_button = document.querySelector("[jigsaw-element='clear_storage_button']");
clear_storage_button.onclick = clear_storage;

function clear_storage() {
    localStorage.clear();
}