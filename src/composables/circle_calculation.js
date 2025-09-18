function calculate_rotates(num) {
    const unit = 360 / num;
    const rotates = [];
    for (let i = 0; i < num; i++) {
        rotates.push(i * unit);
    }
    return rotates;
}

function calculate_tops(num, alpha, radius, side_length) {
    const tops = [];
    for (let k = 0; k < num; k++) {
        tops.push(Math.abs(radius * Math.sin(alpha - (2 * Math.PI * k / num)) - (side_length / 2)));
    }
    return tops;
}

function calculate_lefts(num, alpha, radius, side_length) {
    const lefts = [];
    for (let k = 0; k < num; k++) {
        lefts.push(Math.abs(radius * Math.cos(alpha - (2 * Math.PI * k / num)) + (side_length / 2)));
    }
    return lefts;
}

export {calculate_rotates};
export {calculate_tops};
export {calculate_lefts};