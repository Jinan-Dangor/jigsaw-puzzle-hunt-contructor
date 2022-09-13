var data_cookie = 'PUZZLE_DATA={"contents":[{"class":"round","ID":"ROUND01","page":"round01.html","round":"Round 01","contents":[{"class":"puzzle","ID":"PUZZLE01","name":"Puzzle 01","solution":"Solution 01","page":"puzzle01.html"},{"class":"puzzle","ID":"PUZZLE02","name":"Puzzle 02","solution":"Solution 02","page":"puzzle02.html"},{"class":"puzzle","ID":"PUZZLE03","name":"Puzzle 03","solution":"Solution 03","page":"puzzle03.html"}]},{"class":"round","ID":"ROUND02","page":"round02.html","round":"Round 02","contents":[{"class":"puzzle","ID":"PUZZLE04","name":"Puzzle 04","solution":"Solution 04","page":"puzzle04.html"},{"class":"puzzle","ID":"PUZZLE05","name":"Puzzle 05","solution":"Solution 05","page":"puzzle05.html"},{"class":"puzzle","ID":"PUZZLE06","name":"Puzzle 06","solution":"Solution 06","page":"puzzle06.html"},{"class":"round","ID":"METAROUND","page":"metaround.html","round":"Round (Meta)","contents":[{"class":"puzzle","ID":"PUZZLE07","name":"Puzzle 07","solution":"Solution 07","page":"puzzle07.html"},{"class":"puzzle","ID":"PUZZLE08","name":"Puzzle 08","solution":"Solution 08","page":"puzzle08.html"},{"class":"puzzle","ID":"PUZZLE09","name":"Puzzle 09","solution":"Solution 09","page":"puzzle09.html"}]}]}]}';

// 'data_cookie' set through template_executor
setCookie("PUZZLES_SOLVED=1;" + data_cookie + ";", 9999, "/");

function setCookie(content, exdays, path) {
    console.log("Setting cookie");
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString() + ";";
    document.cookie = content + expires + "path=" + path + ";";
    console.log("Cookies: " + document.cookie);
}