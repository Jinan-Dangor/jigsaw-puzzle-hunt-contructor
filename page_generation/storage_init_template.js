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
    console.log("Collecting " + setting_id);
    let setting_type = hunt_settings_details[setting_id].type;
    switch (setting_type) {
        case "boolean":
            console.log("Boolean for " + setting_id + " is check: " + document.getElementById(setting_id).checked);
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