var puzzle_data = '{"contents":[{"class":"round","ID":"ROUND01","page":"round01.html","round":"Round 01","contents":[{"class":"puzzle","ID":"PUZZLE01","name":"Puzzle 01","solution":"Solution 01","page":"puzzle01.html"},{"class":"puzzle","ID":"PUZZLE02","name":"Puzzle 02","solution":"Solution 02","page":"puzzle02.html"},{"class":"puzzle","ID":"PUZZLE03","name":"Puzzle 03","solution":"Solution 03","page":"puzzle03.html"},{"class":"puzzle","ID":"PUZZLE04","name":"Puzzle 04","solution":"Solution 04","unlock_condition":"NUM_UNLOCKS:1","page":"puzzle04.html"},{"class":"puzzle","ID":"PUZZLE05","name":"Puzzle 05","solution":"Solution 05","unlock_condition":"NUM_UNLOCKS:2","page":"puzzle05.html"},{"class":"puzzle","ID":"PUZZLE06","name":"Puzzle 06","solution":"Solution 06","unlock_condition":"NUM_UNLOCKS:3","page":"puzzle06.html"}]},{"class":"round","ID":"ROUND02","page":"round02.html","round":"Round 02","unlock_condition":"PUZZLE_SOLVED:PUZZLE06","contents":[{"class":"puzzle","ID":"PUZZLE07","name":"Puzzle 07","solution":"Solution 07","page":"puzzle07.html"},{"class":"puzzle","ID":"PUZZLE08","name":"Puzzle 08","solution":"Solution 08","unlock_condition":"NUM_UNLOCKS:5","page":"puzzle08.html"},{"class":"puzzle","ID":"PUZZLE09","name":"Puzzle 09","solution":"Solution 09","unlock_condition":"NUM_UNLOCKS:6","page":"puzzle09.html"},{"class":"round","ID":"METAROUND","page":"metaround.html","round":"Round (Meta)","unlock_condition":"NUM_UNLOCKS:7","contents":[{"class":"puzzle","ID":"PUZZLE10","name":"Puzzle 10","solution":"Solution 10","page":"puzzle10.html"},{"class":"puzzle","ID":"PUZZLE11","name":"Puzzle 11","solution":"Solution 11","page":"puzzle11.html"},{"class":"puzzle","ID":"PUZZLE12","name":"Puzzle 12","solution":"Solution 12","page":"puzzle12.html"}]}]}]}';
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