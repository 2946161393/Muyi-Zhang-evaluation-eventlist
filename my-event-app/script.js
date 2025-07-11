const API_URL = 'http://localhost:3000/events';
const eventTableBody = document.querySelector('#eventTable tbody');
const addEventBtn = document.getElementById('addEventBtn');

async function loadEvents() {
  const res = await fetch(API_URL);
  const events = await res.json();
  eventTableBody.innerHTML = '';

  events.forEach(event => {
    const row = createEventRow(event);
    eventTableBody.appendChild(row);
  });
}

function createEventRow(event) {
  const row = document.createElement('tr');

  if (event.editing) {
    row.innerHTML = `
    <td><input type="text" value="${event.name}" class="edit-name" /></td>
    <td><input type="date" value="${event.start}" class="edit-start" /></td>
    <td><input type="date" value="${event.end}" class="edit-end" /></td>
    <td>
      <button class="save">
        <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/>
        </svg>
      </button>
      <button class="cancel">
        <svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"/>
        </svg>
      </button>
    </td>
  `;
  
  } else {
    row.innerHTML = `
    <td>${event.name}</td>
    <td>${event.start}</td>
    <td>${event.end}</td>
    <td>
      <button class="edit">
        c
      </button>
      <button class="delete">
        <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
      </button>
    </td>
  `;
  
  }

  row.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => handleAction(event, button.className));
  });

  row.dataset.id = event.id;
  return row;
}


function createAddRow() {
  const row = document.createElement('tr');
  row.classList.add('add-row');

  row.innerHTML = `
  <td><input type="text" class="new-name" placeholder="Event Name" /></td>
  <td><input type="date" class="new-start" /></td>
  <td><input type="date" class="new-end" /></td>
  <td>
    <button class="confirm-add">
      <svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6V18M18 12H6" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <button class="cancel-add">
      <svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"/>
      </svg>
    </button>
  </td>
`;


  row.querySelector('.confirm-add').addEventListener('click', async () => {
    const name = row.querySelector('.new-name').value.trim();
    const start = row.querySelector('.new-start').value;
    const end = row.querySelector('.new-end').value;

    if (name && start && end) {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, start, end })
      });
      loadEvents();
    } else {
      alert('Please fill all fields');
    }
  });

  row.querySelector('.cancel-add').addEventListener('click', () => {
    row.remove();
  });

  return row;
}

async function handleAction(event, action) {
  if (action === 'edit') {
    event.editing = true;
    refreshRow(event);
  } else if (action === 'cancel') {
    event.editing = false;
    refreshRow(event);
  } else if (action === 'save') {
    const row = document.querySelector(`tr[data-id='${event.id}']`);
    const name = row.querySelector('.edit-name').value;
    const start = row.querySelector('.edit-start').value;
    const end = row.querySelector('.edit-end').value;

    const updated = { name, start, end };
    await fetch(`${API_URL}/${event.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    loadEvents();
  } else if (action === 'delete') {
    await fetch(`${API_URL}/${event.id}`, { method: 'DELETE' });
    loadEvents();
  }
}

function refreshRow(event) {
  const row = document.querySelector(`tr[data-id='${event.id}']`);
  const newRow = createEventRow(event);
  eventTableBody.replaceChild(newRow, row);
}

addEventBtn.addEventListener('click', () => {
  if (document.querySelector('.add-row')) return; // 防止重复插入

  const addRow = createAddRow();
  eventTableBody.appendChild(addRow);
});

loadEvents();
