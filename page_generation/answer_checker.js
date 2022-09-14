let puzzle_data = JSON.parse(localStorage.getItem("puzzle_data"));
let puzzle_id = document.querySelector("[jigsaw-id]").getAttribute("jigsaw-id");

let item_and_parents = get_item_and_parents_by_id(puzzle_data, puzzle_id);
let item = item_and_parents.shift();

let answer_submit_button = document.querySelector("[jigsaw-element='answer_submit_button']");
answer_submit_button.onclick = check_answer;

function check_answer() {
    let answer_textbox = document.querySelector("[jigsaw-element='answer_submit_entry']");
    let normalised_answer = answer_textbox.value.replace(/[^a-zA-Z\d]/g,'').toUpperCase();
    if (item.solution.replace(/[^a-zA-Z\d]/g,'').toUpperCase() == normalised_answer) {
        console.log("Right answer: " + normalised_answer);
        correct_answer(normalised_answer);
    } else {
        console.log("Wrong answer: " + normalised_answer);
        incorrect_answer(normalised_answer);
    }
}

var answer_correct_area = document.querySelector("[jigsaw-element='answer_correct_area']");
var answer_incorrect_area = document.querySelector("[jigsaw-element='answer_incorrect_area']");

var active_answer_box = "none";
var answer_correct_area_other_display = "none";
var answer_incorrect_area_other_display = "none";
[answer_correct_area_other_display, answer_correct_area.style.display] = [answer_correct_area.style.display, answer_correct_area_other_display];
[answer_incorrect_area_other_display, answer_incorrect_area.style.display] = [answer_incorrect_area.style.display, answer_incorrect_area_other_display];

if (localStorage.getItem(item.ID+"_solved") != null) {
    correct_answer(localStorage.getItem(item.ID+"_solved"));
}

function correct_answer(answer) {
    let answer_box = document.querySelector("[jigsaw-element='answer_correct_text']");
    answer_box.innerHTML = answer;

    if (active_answer_box == "none") {
        [answer_correct_area_other_display, answer_correct_area.style.display] = [answer_correct_area.style.display, answer_correct_area_other_display];
        active_answer_box = "correct";
    } else if (active_answer_box == "incorrect") {
        answer_incorrect_area.style.display = "none";
        [answer_correct_area_other_display, answer_correct_area.style.display] = [answer_correct_area.style.display, answer_correct_area_other_display];
    }

    let answer_submit_area = document.querySelector("[jigsaw-element='answer_submit_area']");
    answer_submit_area.style.display = "none";

    localStorage.setItem(item.ID+"_solved", answer);
    localStorage.setItem("puzzles_solved", parseInt(localStorage.getItem("puzzles_solved"))+1);
}

function incorrect_answer(answer) {
    let answer_box = document.querySelector("[jigsaw-element='answer_incorrect_text']");
    answer_box.innerHTML = answer;

    if (active_answer_box == "none") {
        [answer_incorrect_area_other_display, answer_incorrect_area.style.display] = [answer_incorrect_area.style.display, answer_incorrect_area_other_display];
        active_answer_box = "incorrect";
    }
}

function get_field(item, parents, field) {
    if (item.hasOwnProperty(field)) {
        return item[field];
    }
    for (let i = parents.length-1; i >= 0; i--) {
        if (parents[i].hasOwnProperty(field)) {
            return parents[i][field];
        }
    }

    return null;
}

function get_item_and_parents_by_id(data, id) {
    if (data.ID == id) {
        return [data];
    }

    if (!data.hasOwnProperty("contents")) {
        return null;
    }

    for (let i = 0; i < data.contents.length; i++) {
        let child_data = get_item_and_parents_by_id(data.contents[i], id);
        if (child_data != null) {
            child_data.push(data);
            return child_data;
        }
    }

    return null;
}