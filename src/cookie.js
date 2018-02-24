export function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export function getCookie(name) {
    return getCookies()[name];
}

export function setCookie(name, value) {
    document.cookie = `${name}=${value};`;
}

function getCookies() {
    return Object.assign(
        ...document.cookie.split(';').map(cookieString => {
            let kv = cookieString.split('=');
            return { [kv[0].trim()]: kv[1].trim() }
        })
    );
}