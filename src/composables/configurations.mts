export const API_route: string = 'http://60.205.243.107/api';
// export const API_route = "http://localhost:5000";

async function getPeriods(): Promise<any> {
    const class_id: string = localStorage.getItem('class') || '';
    const r: Response = await fetch(
        `${API_route}/periods?class_id=${class_id}`,
    );
    if (!r.ok) {
        throw new Error(`Error fetching periods: ${r.statusText}`);
    }
    return r.json();
}

async function getUsers(): Promise<any> {
    const class_id: string = localStorage.getItem('class') || '';
    const r: Response = await fetch(`${API_route}/users?class_id=${class_id}`);
    if (!r.ok) {
        throw new Error(`Error fetching users: ${r.statusText}`);
    }
    return r.json();
}

async function getGroups(): Promise<any> {
    const class_id: string = localStorage.getItem('class') || '';
    const r: Response = await fetch(`${API_route}/groups?class_id=${class_id}`);
    if (!r.ok) {
        throw new Error(`Error fetching groups: ${r.statusText}`);
    }
    return r.json();
}

async function getClasses(): Promise<any> {
    const r: Response = await fetch(`${API_route}/classes`);
    if (!r.ok) {
        throw new Error(`Error fetching classes: ${r.statusText}`);
    }
    return r.json();
}

export { getPeriods, getUsers, getGroups, getClasses };
