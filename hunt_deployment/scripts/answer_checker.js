// Requires local_storage_lib.js

/* Elements:
    - answer_submit_area
        - answer_submit_button
        - answer_submit_entry (mandatory if you have a answer_submit_button)
    - answer_correct_area
        - answer_correct_text
    - answer_incorrect_area
        - answer_incorrect_text
*/

let puzzle_data = JSON.parse(localStorage.getItem("puzzle_data"));
let puzzle_id = document.querySelector("[jigsaw-id]").getAttribute("jigsaw-id");

let item_and_parents = get_item_and_parents_by_id(puzzle_data, puzzle_id);
let item = item_and_parents.shift();

let answer_submit_button = document.querySelector("[jigsaw-element='answer_submit_button']");
if (answer_submit_button != null) { answer_submit_button.onclick = check_answer;}

function check_answer() {
    let answer_textbox = document.querySelector("[jigsaw-element='answer_submit_entry']");
    let normalised_answer = answer_textbox.value.replace(/[^a-zA-Z\d]/g,'').toUpperCase();
    console.log("Comparing " + item.solution.replace(/[^a-zA-Z\d]/g,'').toUpperCase() + " to " + normalised_answer);
    if (item.solution.replace(/[^a-zA-Z\d]/g,'').toUpperCase() == normalised_answer) {
        if (puzzle_data.hunt_settings.use_solution_formats) {
            normalised_answer = format_answer(normalised_answer, item.solution_format);
        }
        correct_answer(normalised_answer);
        log_correct_answer(normalised_answer);
    } else {
        incorrect_answer(normalised_answer);
    }
}

function format_answer(answer, format) {
    if (format == undefined) {
        return answer;
    }
    console.log(answer);
    let formatted_answer = format;
    let answer_pos = 0;
    for (let i = 0; i < format.length; i++) {
        if (format[i] == '.') {
            console.log(formatted_answer[i] + " = " + answer[answer_pos]);
            formatted_answer = str_replace_at(formatted_answer, i, answer[answer_pos]);
            answer_pos++;
            console.log(formatted_answer);
        }
    }
    return formatted_answer;
}

function str_replace_at(str, i, char) {
    return str.substring(0, i) + char + str.substring(i+1);
}

var answer_correct_area = document.querySelector("[jigsaw-element='answer_correct_area']");
if (answer_correct_area != null) {answer_correct_area.setAttribute('style', 'display:none');}

var answer_incorrect_area = document.querySelector("[jigsaw-element='answer_incorrect_area']");
if (answer_incorrect_area != null) { answer_incorrect_area.setAttribute('style', 'display:none');}

var answer_submit_area = document.querySelector("[jigsaw-element='answer_submit_area']");
var correct_answer_box = document.querySelector("[jigsaw-element='answer_correct_text']");
var incorrect_answer_box = document.querySelector("[jigsaw-element='answer_incorrect_text']");

if (localStorage.getItem(item.ID+"_solved") != null) {
    correct_answer(localStorage.getItem(item.ID+"_solved"));
} else if (answer_submit_area != null) {
    answer_submit_area.removeAttribute('style');
}

function correct_answer(answer) {
    if (correct_answer_box != null) {    correct_answer_box.innerHTML = answer;}
    if (answer_correct_area != null) {   answer_correct_area.removeAttribute('style');}
    if (answer_incorrect_area != null) { answer_incorrect_area.setAttribute('style', 'display:none');}
    if (answer_submit_area != null) {    answer_submit_area.setAttribute('style', 'display:none');}
}

function log_correct_answer(answer) {
    localStorage.setItem(item.ID+"_solved", answer);
    localStorage.setItem("puzzles_solved", parseInt(localStorage.getItem("puzzles_solved"))+1);
}

function incorrect_answer(answer) {
    if (incorrect_answer_box != null) {  incorrect_answer_box.innerHTML = answer;}
    if (answer_incorrect_area != null) { answer_incorrect_area.removeAttribute('style');}
}