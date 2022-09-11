const fs = require("fs");

var puzzle_data;
data = fs.readFileSync("../data/puzzle_data.json", "utf8");
const file_data = data.toString();
puzzle_data = JSON.parse(file_data);
console.log(puzzle_data.contents[0].ID);

fs.readFile("puzzle_page.html", (err, data) => {
  if (err) throw err;

  var page_file = data.toString();

  console.log(page_file);

  fs.appendFile('puzzle_page_copy.html', page_file, function (err) {
    if (err) throw err;

    console.log('Saved!');
  });
});
