const STORAGE_TOKEN = 'XNC8MLX5LB4ISE8IDUYSCJ9SQJQR8YQIUEWHY83J';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

async function setItem(key, value) {
    const payload = {key, value, token: STORAGE_TOKEN};
    return fetch(STORAGE_URL, {method: 'POST', body: JSON.stringify(payload)})
        .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        // Verbesserter code
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}

async function deleteItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url, {method: 'DELETE'}).then(async res => {
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to delete item with key "${key}": ${errorText}`);
        }
        return res.json();
    });

}
