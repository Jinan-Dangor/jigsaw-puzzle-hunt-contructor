const fs = require("fs");

var puzzle_data;
{
  data = fs.readFileSync("../data/puzzle_data.json", "utf8");
  const file_data = data.toString();
  puzzle_data = JSON.parse(file_data);
}

var round_page_html;
{
  data = fs.readFileSync("round_page_template.html", "utf8");
  round_page_html = data.toString();
}

var puzzle_page_html;
{
  data = fs.readFileSync("puzzle_page_template.html", "utf8");
  puzzle_page_html = data.toString();
}

for (let i = 0; i < puzzle_data.contents.length; i++) {
  generate_page(puzzle_data.contents[i], []);
}

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
  let round_page_html_modified = make_subtitutions(round_page_html, round, parents);
  fs.appendFile("round_page_" + round.page, round_page_html_modified, function (err) {
    if (err) throw err;
  });

  for (let i = 0; i < round.contents.length; i++) {
    let new_parents = Array.from(parents);
    new_parents.push(round);
    generate_page(round.contents[i], new_parents);
  }
}

function generate_puzzle_page(puzzle, parents) {
  let puzzle_page_html_modified = make_subtitutions(puzzle_page_html, puzzle, parents);
  fs.appendFile("puzzle_page_" + puzzle.page, puzzle_page_html_modified, function (err) {
    if (err) throw err;
  });
}

function make_subtitutions(page, item, parents) {
  const spaces_to_fill = page.match(/\%JIGSAW\%[^%]*\%[^%]*\%/g);
  for (let i = 0; i < spaces_to_fill.length; i++) {
    let new_text = get_field(item, parents, spaces_to_fill[i].split("%")[3]);
    page = page.replace(spaces_to_fill[i], new_text);
  }
  return page;
}

function get_field(item, parents, field) {
  console.log("Looking to get the field " + field + " for item " + item.ID);
  if (item.hasOwnProperty(field)) {
    return item[field];
  }
  console.log("Doesn't have it, checking parents");
  for (let i = parents.length-1; i >= 0; i--) {
    console.log("Checking parent: " + parents[i].ID);
    if (parents[i].hasOwnProperty(field)) {
      return parents[i][field];
    }
  }

  return null;
}