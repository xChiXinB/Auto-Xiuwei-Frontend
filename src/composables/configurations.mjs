// export const pre_api = "http://60.205.243.107/api";
export const pre_api = "http://localhost:5000";

export const periods = await fetch(`${pre_api}/periods`).then(r => r.json());
export const users = await fetch(`${pre_api}/users`).then(r => r.json());
export const groups = await fetch(`${pre_api}/groups`).then(r => r.json());
