// 全局变量
let events = [];
let editingId = null;

// 页面加载完成后运行
document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
    document.getElementById('addBtn').addEventListener('click', showAddForm);
});

// 从服务器加载事件
function loadEvents() {
    fetch('http://localhost:3000/events')
        .then(response => response.json())
        .then(data => {
            events = data;
            console.log('Loaded events:', events);
            showEvents();
        })
        .catch(error => {
            console.error('Error loading events:', error);
            document.getElementById('eventsBody').innerHTML = 
                '<tr><td colspan="4" style="text-align: center; color: #c94c4c; padding: 40px;">Error loading events. Make sure JSON Server is running on port 3000.</td></tr>';
        });
}

// 显示所有事件
function showEvents() {
    const tbody = document.getElementById('eventsBody');
    tbody.innerHTML = '';
    
    if (events.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="4">
                    <h3>No events found</h3>
                    <p>Click "Add New Event" to create your first event.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    events.forEach(event => {
        const row = document.createElement('tr');
        
        if (editingId === event.id) {
            // 编辑模式
            row.innerHTML = `
                <td>
                    <input type="text" class="event-input" id="editName" value="${escapeHtml(event.eventName || event.name || '')}">
                </td>
                <td>
                    <input type="date" class="event-input" id="editStart" value="${event.startDate}">
                </td>
                <td>
                    <input type="date" class="event-input" id="editEnd" value="${event.endDate}">
                </td>
                <td>
                    <div class="actions-cell">
                        <button class="action-btn save-btn" onclick="saveEdit(${event.id})" title="Save Event">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/>
                            </svg>
                        </button>
                        <button class="action-btn cancel-btn" onclick="cancelEdit()" title="Cancel Edit">
                            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"/>
                            </svg>
                        </button>
                    </div>
                </td>
            `;
        } else {
            // 显示模式
            row.innerHTML = `
                <td>${escapeHtml(event.eventName || event.name || '')}</td>
                <td>${formatDate(event.startDate)}</td>
                <td>${formatDate(event.endDate)}</td>
                <td>
                    <div class="actions-cell">
                        <button class="action-btn edit-btn" onclick="editEvent(${event.id})" title="Edit Event">
                            <svg viewBox="0 0 24 24">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteEvent(${event.id})" title="Delete Event">
                            <svg viewBox="0 0 24 24">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                        </button>
                    </div>
                </td>
            `;
        }
        
        tbody.appendChild(row);
    });
}

// 显示添加表单
function showAddForm() {
    const tbody = document.getElementById('eventsBody');
    
    // 移除已存在的添加行
    const existingAddRow = document.querySelector('.add-row');
    if (existingAddRow) {
        existingAddRow.remove();
    }
    
    // 取消编辑模式
    editingId = null;
    
    const addRow = document.createElement('tr');
    addRow.className = 'add-row';
    addRow.innerHTML = `
        <td>
            <input type="text" class="event-input" id="newName" placeholder="Event name">
        </td>
        <td>
            <input type="date" class="event-input" id="newStart">
        </td>
        <td>
            <input type="date" class="event-input" id="newEnd">
        </td>
        <td>
            <div class="actions-cell">
                <button class="action-btn save-btn" onclick="saveNew()" title="Save Event">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/>
                    </svg>
                </button>
                <button class="action-btn cancel-btn" onclick="hideAddForm()" title="Cancel">
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"/>
                    </svg>
                </button>
            </div>
        </td>
    `;
    
    tbody.appendChild(addRow);
    
    // 重新显示其他事件
    showEvents();
    
    // 把添加行移到最前面
    tbody.insertBefore(addRow, tbody.firstChild);
    
    // 聚焦到名称输入框
    document.getElementById('newName').focus();
}

// 隐藏添加表单
function hideAddForm() {
    const addRow = document.querySelector('.add-row');
    if (addRow) {
        addRow.remove();
    }
}

// 保存新事件
function saveNew() {
    const name = document.getElementById('newName').value.trim();
    const start = document.getElementById('newStart').value;
    const end = document.getElementById('newEnd').value;
    
    if (!name || !start || !end) {
        alert('Please fill all fields');
        return;
    }
    
    if (new Date(start) > new Date(end)) {
        alert('End date must be after start date');
        return;
    }
    
    const newEvent = {
        eventName: name,
        startDate: start,
        endDate: end
    };
    
    console.log('Creating new event:', newEvent);
    
    fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create event');
        }
        return response.json();
    })
    .then(data => {
        console.log('Event created:', data);
        events.push(data);
        hideAddForm();
        showEvents();
    })
    .catch(error => {
        console.error('Error creating event:', error);
        alert('Error saving event. Please try again.');
    });
}

// 编辑事件
function editEvent(id) {
    console.log('Editing event:', id);
    editingId = id;
    showEvents();
    
    // 聚焦到名称输入框
    setTimeout(() => {
        const nameInput = document.getElementById('editName');
        if (nameInput) {
            nameInput.focus();
        }
    }, 0);
}

// 保存编辑
function saveEdit(id) {
    const name = document.getElementById('editName').value.trim();
    const start = document.getElementById('editStart').value;
    const end = document.getElementById('editEnd').value;
    
    if (!name || !start || !end) {
        alert('Please fill all fields');
        return;
    }
    
    if (new Date(start) > new Date(end)) {
        alert('End date must be after start date');
        return;
    }
    
    const updatedEvent = {
        eventName: name,
        startDate: start,
        endDate: end
    };
    
    console.log('Updating event:', id, updatedEvent);
    
    fetch(`http://localhost:3000/events/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEvent)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update event');
        }
        return response.json();
    })
    .then(data => {
        console.log('Event updated:', data);
        const index = events.findIndex(e => e.id == id);
        if (index !== -1) {
            events[index] = data;
        }
        editingId = null;
        showEvents();
    })
    .catch(error => {
        console.error('Error updating event:', error);
        alert('Error updating event. Please try again.');
    });
}

// 取消编辑
function cancelEdit() {
    console.log('Cancelling edit');
    editingId = null;
    showEvents();
}

// 删除事件
function deleteEvent(id) {
    console.log('Deleting event:', id);
    
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }
    
    fetch(`http://localhost:3000/events/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete event');
        }
        console.log('Event deleted successfully');
        events = events.filter(e => e.id != id);
        showEvents();
    })
    .catch(error => {
        console.error('Error deleting event:', error);
        alert('Error deleting event. Please try again.');
    });
}

// 工具函数
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}