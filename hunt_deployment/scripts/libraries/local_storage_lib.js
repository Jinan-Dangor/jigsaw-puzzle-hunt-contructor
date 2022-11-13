// This document contains shared functions for manipulating data stored in localStorage

// This function is duplicated in the template_executor
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

function get_item_and_parents_by_id(data, id) {
    if (data.ID == id) {
        return [data];
    }

    if (!data.hasOwnProperty("contents")) {
        return null;
    }

    for (let i = 0; i < data.contents.length; i++) {
        let child_data = get_item_and_parents_by_id(data.contents[i], id);
        if (child_data != null) {
            child_data.push(data);
            return child_data;
        }
    }

    return null;
}