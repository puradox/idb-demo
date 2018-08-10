import idb from '/node_modules/idb/lib/idb.js';

async function open() {
  return await idb.open('demo', 1, upgradeDB => {
    if (upgradeDB.oldVersion < 1) {
      upgradeDB.createObjectStore('messages');
    }
  })
}

async function write(key, value) {
  const db = await open();
  const transaction = db.transaction('messages', 'readwrite');
  transaction.objectStore('messages').put(value, key);
  await transaction.complete;
  db.close();
}

async function read(key) {
  const db = await open();
  const transaction = db.transaction('messages', 'readonly');
  return await transaction.objectStore('messages').get(key);
  db.close();
}

async function render() {
  await write('welcome', 'Hello world!');

  const message = document.createElement('p');
  message.textContent = await read('welcome');
  document.body.appendChild(message);
}

render();
