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

// Doesn't yet account for timed unlocks
function evaluate_num_unlocks(target) {
    let num_unlocks = parseInt(localStorage.getItem("puzzles_solved"));
    return num_unlocks >= target;
}

function evaluate_puzzle_solved(puzzle_id) {
    console.log(puzzle_id);
    console.log(localStorage.getItem(puzzle_id+"_solved"));
    console.log(localStorage.getItem(puzzle_id+"_solved") != null);
    return localStorage.getItem(puzzle_id+"_solved") != null;
}

function evaluate_puzzle_unlocked(puzzle_id) {
    let puzzle_data = JSON.parse(localStorage.getItem("puzzle_data"));
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