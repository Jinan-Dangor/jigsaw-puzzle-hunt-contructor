const fs = require("fs");

// USER MAY WISH TO CHANGE THESE VARIABLES
// Pages to create for each round
var round_pages = ["round_page_template.html"];
// Pages to create for each puzzle
var puzzle_pages = ["puzzle_page_template.html", "call_in_answer_page_template.html", "solution_page_template.html"];

// BE CAREFUL EDITTING ANYTHING FROM HERE ONWARDS
var puzzle_data;
{ let data = fs.readFileSync("../data/puzzle_data.json", "utf8");
  const file_data = data.toString();
  puzzle_data = JSON.parse(file_data);
}

var round_pages_html = [];
for (let i = 0; i < round_pages.length; i++) {
  let data = fs.readFileSync(round_pages[i], "utf8");
  round_pages_html.push(data.toString());
}

var puzzle_pages_html = [];
for (let i = 0; i < puzzle_pages.length; i++) {
  let data = fs.readFileSync(puzzle_pages[i], "utf8");
  puzzle_pages_html.push(data.toString());
}

var hunt_settings_page_html;
{
  let data = fs.readFileSync("hunt_settings_page_template.html", "utf8");
  hunt_settings_page_html = data.toString();
}

// Generate Pages
for (let i = 0; i < puzzle_data.contents.length; i++) {
  generate_page(puzzle_data.contents[i], []);
}

// Generate Initial Storage
var storage_init_script;
{ let data = fs.readFileSync("storage_init_template.js", "utf8");
storage_init_script = data.toString();
}
storage_init_script = "var puzzle_data = '" + JSON.stringify(puzzle_data) + "';\n" + storage_init_script;
fs.writeFileSync("../hunt_deployment/scripts/storage_init.js", storage_init_script);

// Generate hunt settings page
let hunt_settings_body = "";
for (let i = 0; i < puzzle_data.hunt_settings_format.shown_settings_list.length; i++) {
  let settings_obj = puzzle_data.hunt_settings_format.settings_details[puzzle_data.hunt_settings_format.shown_settings_list[i]];
  hunt_settings_body += get_hunt_settings_component(settings_obj, puzzle_data.hunt_settings_format.shown_settings_list[i], puzzle_data.hunt_settings_format.settings_details);
  hunt_settings_body += "<br>\n";
}
let hunt_settings_page = hunt_settings_page_html.replace("%JIGSAW%HUNT_SETTINGS%PLACEHOLDER%", hunt_settings_body);
fs.writeFileSync("../hunt_deployment/pages/hunt_settings_page.html", hunt_settings_page);




function generate_page(item, parents) {
  if (item.class == "round") {
    generate_round_page(item, parents);
  } else if (item.class == "puzzle") {
    generate_puzzle_page(item, parents);
  } else {
    throw {name : "JigsawClassNotFoundError", message : "The class " + item.class + " could not be found"};
  }
}

function generate_round_page(round, parents) {
  for (let i = 0; i < round_pages_html.length; i++) {
    let round_page_html_modified = make_subtitutions(round_pages_html[i], round, parents);
    round_page_html_modified += '\n\n<script src="../scripts/libraries/local_storage_lib.js"></script>';
    round_page_html_modified += '\n\n<script src="../scripts/template_filler.js"></script>';
    fs.writeFileSync("../hunt_deployment/pages/" + round.ID + "_" + round_pages[i].replace("_page_template.html", "") + ".html", round_page_html_modified);
  }
  

  for (let i = 0; i < round.contents.length; i++) {
    let new_parents = Array.from(parents);
    new_parents.push(round);
    generate_page(round.contents[i], new_parents);
  }
}

function generate_puzzle_page(puzzle, parents) {
  for (let i = 0; i < puzzle_pages_html.length; i++) {
    let puzzle_page_html_modified = make_subtitutions(puzzle_pages_html[i], puzzle, parents);
    puzzle_page_html_modified += '\n\n<script src="../scripts/libraries/local_storage_lib.js"></script>';
    puzzle_page_html_modified += '\n\n<script src="../scripts/template_filler.js"></script>';
    fs.writeFileSync("../hunt_deployment/pages/" + puzzle.ID + "_" + puzzle_pages[i].replace("_page_template.html", "") + ".html", puzzle_page_html_modified);
  }
}

function make_subtitutions(page, item, parents) {
  const spaces_to_fill = page.match(/\%JIGSAW\%[^%]*\%[^%]*\%/g);
  for (let i = 0; i < spaces_to_fill.length; i++) {
    let arguments = spaces_to_fill[i].split("%");
    let new_text = get_field(item, parents, arguments[3]);
    if (arguments[2] == "PLACEHOLDER") {
      page = substitute_placeholder(page, spaces_to_fill[i], new_text);
    } else if (arguments[2] == "FILE") {
      page = substitute_file(page, spaces_to_fill[i], new_text);
    }
  }
  page = make_elements_hidden(page);

  return page;
}

// This function is duplicated in the local_storage_lib
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

function substitute_placeholder(page, placeholder, text) {
  return page.replace(placeholder, text);
}

function substitute_file(page, placeholder, file) {
  var file_contents;
  {
    let data = fs.readFileSync("resources/"+file, "utf8");
    file_contents = data.toString();
  }

  return page.replace(placeholder, file_contents);
}

function make_elements_hidden(page) {
  let hidden_jigsaw_elements = ["answer_submit_area", "answer_correct_area", "answer_incorrect_area"];
  page = page.replaceAll("jigsaw-hidden", "style='display:none', jigsaw-hidden");

  for (let i = 0; i < hidden_jigsaw_elements.length; i++) {
    let search_string = 'jigsaw-element="' + hidden_jigsaw_elements[i] + '"';
    page = page.replaceAll(search_string, 'style="display:none", ' + search_string);
  }

  return page;
}

function get_hunt_settings_component(settings, settings_id, settings_details) {
  let id = settings_id;
  let type = settings.type;
  let name = settings.name;
  let description = settings.description;
  switch (type) {
    case "boolean":
      return `<input type="checkbox" id="${id}"><label for="${id}">${name}</label>`;
    // Currently integer are 1, minimum - may be worth adding additional settings
    case "integer":
      return `<label for="${id}">${name}</label><input type="number" id="${id}" min="1">`;
    case "date_time":
      return `<label for="${id}">${name}</label><input type="datetime-local" id="${id}">`;
    case "list":
      let list_contents = `<label for="${id}">${name}</label><select id="${id}">\n`;
      for (let i = 0; i < settings.list.length; i++) {
        list_contents += `<option value="${settings.list[i]}">${settings.list[i]}</option>`;
        list_contents += "\n";
      }
      list_contents += `</select>\n`;
      return list_contents;
    case "optional_array":
      let optional_array_contents = `<h2>${name}</h2>\n`;
      for (let i = 0; i < settings.array_contents.length; i++) {
        optional_array_contents += get_hunt_settings_component(settings_details[settings.array_contents[i]], settings.array_contents[i], settings_details);
        optional_array_contents += "<br>\n";
      }
      return optional_array_contents;
    default:
      return `<!---Type ${type} not supported--->`;
  }

}