var puzzle_data = JSON.parse(localStorage.getItem("puzzle_data"));

var waiting_to_start_timer = document.querySelectorAll("[jigsaw-element='waiting_to_start_timer']")[0];

if (puzzle_data != null && waiting_to_start_timer != null) {
    setInterval(update_time, 1000);
    let now = Date.now();
    console.log(now);
    let start_time = new Date(puzzle_data.hunt_settings.start_time);
    console.log(start_time);
    var time_left = Math.floor((start_time-now)/1000);
    waiting_to_start_timer.innerHTML = `The hunt will start in ${seconds_to_nice_time(time_left)}.`;
}

function update_time() {
    time_left--;
    waiting_to_start_timer.innerHTML = `The hunt will start in ${seconds_to_nice_time(time_left)}.`;
}

// 'nice time' displays the two most sigificant numbers out of days, hours, minutes and seconds
// If the hunt starts in over a month, it displays the date and time in standard javascript format
function seconds_to_nice_time(time) {
    let seconds = time%60;
    let minutes = Math.floor(time/60);
    let hours   = Math.floor(time/60/60);
    let days    = Math.floor(time/60/60/24);

    if (days > 31) {
        return `The hunt will start on ${time.toTimeString()}.`;
    }

    if (days > 0) {
        return `${days} days and ${hours} hours`;
    } else if (hours > 0) {
        return `${hours} hours and ${minutes} minutes`;
    } else if (minutes > 0) {
        return `${minutes} minutes and ${seconds} seconds`;
    } else {
        return `${seconds} seconds`;
    }
}