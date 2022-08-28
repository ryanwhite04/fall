
let db;
const request = indexedDB.open("game", 1);
request.onerror = event => {
    console.error(event.target);
}
request.onsuccess = event => {
    db = event.target.result;
    console.log(db);
}
request.onupgradeneeded = upgradeDatabase;
function upgradeDatabase(event) {
    const db = event.target.result;
    const store = db.createObjectStore("cells", {
        keyPath: "coordinate",
    });
    store.transaction.oncomplete = event => {
        const store = db.transaction("cells", "readwrite").objectStore("cells");
        store.add({ coordinate: 1 });
    };
}
