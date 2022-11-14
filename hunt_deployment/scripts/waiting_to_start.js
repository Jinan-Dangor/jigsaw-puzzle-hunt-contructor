var puzzle_data = JSON.parse(localStorage.getItem("puzzle_data"));

var waiting_to_start_timer = document.querySelectorAll("[jigsaw-element='waiting_to_start_timer']")[0];

if (puzzle_data != null && waiting_to_start_timer != null) {
    console.log("Activated");
    setInterval(update_time, 1000);
    let now = Date.now();
    console.log(now);
    let start_time = new Date(puzzle_data.hunt_settings.start_time);
    console.log(start_time);
    var time_left = Math.floor((start_time-now)/1000);
    waiting_to_start_timer.innerHTML = `The hunt will start in ${time_left} seconds.`;
}

function update_time() {
    console.log("tick tock");
    time_left--;
    waiting_to_start_timer.innerHTML = `The hunt will start in ${time_left} seconds.`;
}