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

    if        (condition_type == "NUM_UNLOCKS") {
        return evaluate_num_unlocks(parseInt(condition_args));
    } else if (condition_type == "PUZZLE_SOLVED") {
        return evaluate_puzzle_solved(condition_args);
    } else if (condition_type == "PUZZLE_UNLOCKED") {
        return evaluate_puzzle_unlocked(condition_args);
    } else {
        return false;
    }
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