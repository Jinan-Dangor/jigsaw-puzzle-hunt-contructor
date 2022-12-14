var puzzle_data = '{"contents":[{"class":"round","ID":"ROUND01","page":"round01.html","round":"Round 01","contents":[{"class":"puzzle","ID":"PUZZLE01","name":"Puzzle 01, answer BOONDOCKS","solution":"BOONDOCKS","unlock_condition":"NUM_UNLOCKS:1","page":"puzzle01.html"},{"class":"puzzle","ID":"PUZZLE02","name":"Puzzle 02, answer I\'M ALIVE","solution":"I\'M ALIVE","solution_format":".\'. .....","unlock_condition":"NUM_UNLOCKS:2","page":"puzzle02.html"},{"class":"puzzle","ID":"PUZZLE03","name":"Puzzle 03, answer ONE-BY-ONE","solution":"ONE-BY-ONE","solution_format":"...-..-...","unlock_condition":"NUM_UNLOCKS:3","page":"puzzle03.html"},{"class":"puzzle","ID":"PUZZLE04","name":"Puzzle 04, answer YES/NO","solution":"YES/NO","solution_format":".../..","unlock_condition":"NUM_UNLOCKS:4","page":"puzzle04.html"},{"class":"puzzle","ID":"PUZZLE05","name":"Puzzle 05, answer THIS IS WHAT I NEED","solution":"THIS IS WHAT I NEED","solution_format":".... .. .... . ....","unlock_condition":"NUM_UNLOCKS:5","page":"puzzle05.html"},{"class":"puzzle","ID":"PUZZLE06","name":"Puzzle 06, answer WHY?","solution":"WHY?","solution_format":"...?","unlock_condition":"NUM_UNLOCKS:6","page":"puzzle06.html"}]},{"class":"round","ID":"ROUND02","page":"round02.html","round":"Round 02","unlock_condition":"PUZZLE_SOLVED:PUZZLE06","contents":[{"class":"puzzle","ID":"PUZZLE07","name":"Puzzle 07","solution":"Solution 07","unlock_condition":"NUM_UNLOCKS:7","page":"puzzle07.html"},{"class":"puzzle","ID":"PUZZLE08","name":"Puzzle 08","solution":"Solution 08","unlock_condition":"NUM_UNLOCKS:8","page":"puzzle08.html"},{"class":"puzzle","ID":"PUZZLE09","name":"Puzzle 09","solution":"Solution 09","unlock_condition":"NUM_UNLOCKS:9","page":"puzzle09.html"},{"class":"round","ID":"METAROUND","page":"metaround.html","round":"Round (Meta)","unlock_condition":"NUM_UNLOCKS:10","contents":[{"class":"puzzle","ID":"PUZZLE10","name":"Puzzle 10","solution":"Solution 10","page":"puzzle10.html"},{"class":"puzzle","ID":"PUZZLE11","name":"Puzzle 11","solution":"Solution 11","page":"puzzle11.html"},{"class":"puzzle","ID":"PUZZLE12","name":"Puzzle 12","solution":"Solution 12","page":"puzzle12.html"}]}]}],"hunt_settings_format":{"shown_settings_list":["start_time","starting_unlocked_puzzles","puzzle_unlocks","hint_unlocks","solution_unlocks","reveal_full_solution_after_solve","restrict_unlocks_to_round"],"settings_details":{"start_time":{"type":"date_time","name":"Hunt Start","description":"The date/time for your hunt to start."},"starting_unlocked_puzzles":{"type":"integer","name":"Initial Puzzles","description":"How many puzzles you want unlocked when the hunt starts."},"puzzle_unlocks":{"type":"optional_array","name":"Puzzle Unlocks Over Time","description":"When (if at all) do you want puzzles to unlock over time?","array_contents":["unlock_schedule","unlock_period","unlock_frequency"]},"hint_unlocks":{"type":"optional_array","name":"Hint Unlocks Over Time","description":"When (if at all) do you want hints to unlock over time?","array_contents":["unlock_schedule","unlock_period","unlock_frequency"]},"solution_unlocks":{"type":"optional_array","name":"Solution Unlocks Over Time","description":"When (if at all) do you want to unlock solutions to puzzles for free?","array_contents":["unlock_schedule","unlock_period","unlock_frequency"]},"unlock_schedule":{"type":"list","name":"Unlock Schedule","description":"Unlock regularly after a period of time, or set specific dates/time for unlocks?","list":["regular","irregular"]},"unlock_period":{"type":"list","name":"Unlock Period","description":"What interval do you want to set for unlocks?","list":["hours","days","weeks"]},"unlock_frequency":{"type":"integer","name":"Unlock Frequency","description":"One puzzle will unlock after this many Unlock Periods have passed."},"reveal_full_solution_after_solve":{"type":"boolean","name":"Reveal Solutions","description":"Reveal the full solution to a puzzle after solving it."},"restrict_unlocks_to_round":{"type":"boolean","name":"Round-Lock Unlocks","description":"Solving a puzzle will only ever unlock puzzles from its round."}}},"hunt_settings":{"hunt_name":"Test Hunt","start_time":"","starting_unlocked_puzzles":"1","puzzle_unlocks":[{"unlock_schedule":"regular","unlock_period":"hours","unlock_frequency":"1"}],"hint_unlocks":[{"unlock_schedule":"regular","unlock_period":"hours","unlock_frequency":"1"}],"solution_unlocks":[{"unlock_schedule":"regular","unlock_period":"hours","unlock_frequency":"2"}],"use_solution_formats":"true","reveal_full_solution_after_solve":"false","restrict_unlocks_to_round":"false"}}';
// template_filler.js adds var puzzle_data
var puzzle_data_obj = JSON.parse(puzzle_data);

let init_storage_button = document.querySelector("[jigsaw-element='init_storage_button']");
init_storage_button.onclick = init_storage;

let clear_storage_button = document.querySelector("[jigsaw-element='clear_storage_button']");
clear_storage_button.onclick = clear_storage;

function init_storage() {
    localStorage.setItem("puzzles_solved", 0);
    puzzle_data_obj.hunt_settings = collect_hunt_settings(puzzle_data_obj.hunt_settings_format, puzzle_data_obj.hunt_settings);
    localStorage.setItem("puzzle_data", JSON.stringify(puzzle_data_obj));
}

function clear_storage() {
    localStorage.clear();
}

function collect_hunt_settings(hunt_settings_format, hunt_settings) {
    for (let i = 0; i < hunt_settings_format.shown_settings_list.length; i++) {
        let new_setting_id = hunt_settings_format.shown_settings_list[i];
        hunt_settings = collect_setting(hunt_settings_format.settings_details, hunt_settings, new_setting_id);
    }
    return hunt_settings;
}

function collect_setting(hunt_settings_details, hunt_settings, setting_id) {
    let setting_type = hunt_settings_details[setting_id].type;
    switch (setting_type) {
        case "boolean":
            hunt_settings[setting_id] = document.getElementById(setting_id).checked;
            break;
        case "integer":
            hunt_settings[setting_id] = document.getElementById(setting_id).value;
            break;
        case "date_time":
            hunt_settings[setting_id] = document.getElementById(setting_id).value;
            break;
        case "list":
            hunt_settings[setting_id] = document.getElementById(setting_id).value;
            break;
        case "optional_array":
            for (let i = 0; i < hunt_settings_details[setting_id].array_contents.length; i++) {
                let new_id = hunt_settings_details[setting_id].array_contents[i];
                hunt_settings[setting_id] = collect_setting(hunt_settings_details, hunt_settings[setting_id], new_id);
            }
            break;
    }

    return hunt_settings;
}