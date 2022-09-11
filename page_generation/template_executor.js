const fs = require("fs");

var puzzle_data;
{
  data = fs.readFileSync("../data/puzzle_data.json", "utf8");
  const file_data = data.toString();
  puzzle_data = JSON.parse(file_data);
}

var content_page_html;
{
  data = fs.readFileSync("round_page_template.html", "utf8");
  content_page_html = data.toString();
}

var puzzle_page_html;
{
  data = fs.readFileSync("puzzle_page_template.html", "utf8");
  puzzle_page_html = data.toString();
}

for (let i = 0; i < puzzle_data.contents.length; i++) {
  generate_page(puzzle_data.contents[i]);
}

function generate_page(item) {
  if (item.class == "round") {
    generate_round_page(item)
  } else if (item.class == "puzzle") {
    generate_puzzle_page(item)
  } else {
    throw {name : "JigsawClassNotFoundError", message : "The class" + item.class + " could not be found"};
  }
}

function generate_round_page(round) {
  fs.appendFile("round_page_" + round.page, puzzle_page_html, function (err) {
    if (err) throw err;
  });

  for (let i = 0; i < round.contents.length; i++) {
    generate_page(round.contents[i]);
  }
}

function generate_puzzle_page(puzzle) {
  fs.appendFile("puzzle_page_" + puzzle.page, content_page_html, function (err) {
    if (err) throw err;
  });
}