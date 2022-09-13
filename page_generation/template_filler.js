let hidden_tags = document.querySelectorAll("[jigsaw-hidden]");

// TODO: initially hidden, unhidden upon not removing
// TODO: if cookies are missing, hide nothing (for offline editting)
for (let i = 0; i < hidden_tags.length; i++) {
    let visible = evaluate_conditions(hidden_tags[i].getAttribute("jigsaw-hidden"));
    if (!visible) {
        hidden_tags[i].remove();
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
    } else {
        return false;
    }
}

// Doesn't yet account for timed unlocks
function evaluate_num_unlocks(target) {
    let num_unlocks = parseInt(localStorage.getItem("puzzles_solved"));
    console.log("Comparing " + num_unlocks + " to the desired " + target + " unlocks.");
    return num_unlocks >= target;
}

function evaluate_puzzle_solved(puzzle_id) {
    return localStorage.getItem(puzzle_id+"_solved") == "TRUE";
}