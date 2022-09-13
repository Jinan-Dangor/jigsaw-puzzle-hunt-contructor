setCookie("PUZZLES_SOLVED=1;", 9999, "/");
console.log("Cookies: " + document.cookie);

function setCookie(content, exdays, path) {
    console.log("Setting cookie");
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString() + ";";
    document.cookie = content + expires + "path=" + path + ";";
}