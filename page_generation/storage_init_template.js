// template_filler.js adds var puzzle_data

let init_storage_button = document.querySelector("[jigsaw-element='init_storage_button']");
init_storage_button.onclick = init_storage;

let clear_storage_button = document.querySelector("[jigsaw-element='clear_storage_button']");
clear_storage_button.onclick = clear_storage;

function init_storage() {
    localStorage.setItem("puzzles_solved", 0);
    localStorage.setItem("puzzle_data", puzzle_data);
}

function clear_storage() {
    localStorage.clear();
}