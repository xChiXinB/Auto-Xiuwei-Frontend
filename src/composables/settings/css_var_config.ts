interface Var {
    [key: string]: string,
}

/**
 * 批量更改css变量
 * @param variables 要更改的css变量-值对象
 */
function set_css_var(variables: Var): void {
    const body = document.body;
    for (const [prop, value] of Object.entries(variables)) {
        body.style.setProperty(prop, value);
    }
}

/**
 * 
 * @param keys 要移除的css变量
 */
function remove_css_var(keys: string[]): void {
    const body = document.body;
    for (const key of keys) {
        body.style.removeProperty(key);
    }
}

export {set_css_var, remove_css_var}