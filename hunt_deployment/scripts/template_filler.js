// Requires local_storage_lib.js

var puzzle_data = JSON.parse(localStorage.getItem("puzzle_data"));

let hidden_tags = document.querySelectorAll("[jigsaw-hidden]");

// TODO: initially hidden, unhidden upon not removing
// TODO: if cookies are missing, hide nothing (for offline editting)
for (let i = 0; i < hidden_tags.length; i++) {
    let visible = evaluate_conditions(hidden_tags[i].getAttribute("jigsaw-hidden"));
    if (!visible) {
        hidden_tags[i].remove();
    } else {
        hidden_tags[i].removeAttribute('style');
    }
}

// Conditions evaluated 'AND'-wise
function evaluate_conditions(condition) {
    let conditions = condition.split(";");
    for (let i = 0; i < conditions.length; i++) {
        if (!evaluate_condition(conditions[i])) {
            return false;
        }
    }
    return true;
}

function evaluate_condition(condition) {
    let condition_breakdown = condition.split(":");
    let condition_type = condition_breakdown[0];
    let condition_args = condition_breakdown[1];
    let result = false;
    let invert = condition_type[0] == '!';
    if (invert) {
        condition_type = condition_type.substring(1);
    }

    if (puzzle_data == null) {
        result = false;
    } else if (condition_type == "NUM_UNLOCKS") {
        result = evaluate_num_unlocks(parseInt(condition_args));
    } else if (condition_type == "PUZZLE_SOLVED") {
        result = evaluate_puzzle_solved(condition_args);
    } else if (condition_type == "PUZZLE_UNLOCKED") {
        result = evaluate_puzzle_unlocked(condition_args);
    } else if (condition_type == "HUNT_READY") {
        result = puzzle_data != null;
    } else if (condition_type == "HUNT_STARTED") {
        let now = Date.now();
        let start_time = new Date(puzzle_data.hunt_settings.start_time);
        result = now >= start_time;
    }

    if (invert) {
        result = !result;
    }

    return result;
}

function evaluate_num_unlocks(target) {
    let num_unlocks = parseInt(localStorage.getItem("puzzles_solved")) + calculate_times_unlocks();
    return num_unlocks >= target;
}

function evaluate_puzzle_solved(puzzle_id) {
    return localStorage.getItem(puzzle_id+"_solved") != null;
}

function evaluate_puzzle_unlocked(puzzle_id) {
    let item_and_parents = get_item_and_parents_by_id(puzzle_data, puzzle_id);
    let item = item_and_parents.shift();
    return evaluate_condition(get_field(item, item_and_parents, "unlock_condition"));
}

function calculate_times_unlocks() {
    let start_date = new Date(puzzle_data.hunt_settings.start_time);
    let now = Date.now();
    let time_elapsed = now - start_date;
    let unlock_period = puzzle_data.hunt_settings.puzzle_unlocks.unlock_period;
    let starting_puzzles = parseInt(puzzle_data.hunt_settings.starting_unlocked_puzzles);
    let puzzles_unlocked = Math.floor(time_elapsed/period_in_ms(unlock_period)) + starting_puzzles;
    return puzzles_unlocked;
}

function period_in_ms(period) {
    let ms_in_an_hour = 1000*60*60;
    let ms_in_a_day = 24*ms_in_an_hour;
    let ms_in_a_week = 7*ms_in_a_day;
    switch (period) {
        case "hours":
            return ms_in_an_hour;
        case "days":
            return ms_in_a_day;
        case "weeks":
            return ms_in_a_week;
        default:
            return ms_in_an_hour;
    }
}