const fs = require("fs");

var puzzle_data;
{ let data = fs.readFileSync("../data/puzzle_data.json", "utf8");
  const file_data = data.toString();
  puzzle_data = JSON.parse(file_data);
}

var round_page_html;
{ let data = fs.readFileSync("round_page_template.html", "utf8");
  round_page_html = data.toString();
}

var puzzle_page_html;
{ let data = fs.readFileSync("puzzle_page_template.html", "utf8");
  puzzle_page_html = data.toString();
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
fs.writeFileSync("storage_init.js", storage_init_script);




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
  let round_page_html_modified = make_subtitutions(round_page_html, round, parents) + '\n\n<script src="template_filler.js"></script>';
  fs.writeFileSync("round_page_" + round.page, round_page_html_modified);

  for (let i = 0; i < round.contents.length; i++) {
    let new_parents = Array.from(parents);
    new_parents.push(round);
    generate_page(round.contents[i], new_parents);
  }
}

function generate_puzzle_page(puzzle, parents) {
  let puzzle_page_html_modified = make_subtitutions(puzzle_page_html, puzzle, parents) + '\n\n<script src="template_filler.js"></script>';
  fs.writeFileSync("puzzle_page_" + puzzle.page, puzzle_page_html_modified);
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