var events = [];

function load() {
  console.log("start loading...");
  fetch("http://localhost:3000/events")
    .then((r) => r.json())
    .then((d) => {
      console.log("got events", d);
      events = d;
      draw();
    })
    .catch((err) => {
      console.error("load fail", err);
      document.querySelector("#eventTable tbody").innerHTML =
        "<tr><td colspan='4'>error load</td></tr>";
    });
}

function draw() {
  var tb = document.querySelector("#eventTable tbody");
  tb.innerHTML = "";

  if (events.length == 0) {
    tb.innerHTML = "<tr><td colspan='4'>no data</td></tr>";
    return;
  }

  for (var i = 0; i < events.length; i++) {
    var e = events[i];
    var tr = document.createElement("tr");
    var n = e.name || "";
    var s = e.start || "";
    var en = e.end || "";

    if (e.editing) {
      tr.innerHTML =
        "<td><input type='text' id='n' value='" +
        n +
        "'></td><td><input type='date' id='s' value='" +
        s +
        "'></td><td><input type='date' id='e' value='" +
        en +
        "'></td><td><div class='action-buttons'>" +
        "<button class='action-btn save' onclick='save(" + e.id + ")'>" +
        "<svg focusable='false' aria-hidden='true' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>" +
        "<path d='M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z'/>" +
        "</svg></button>" +
        "<button class='action-btn cancel' onclick='cancel(" + e.id + ")'>" +
        "<svg focusable='false' aria-hidden='true' viewBox='0 0 32 32' version='1.1' xmlns='http://www.w3.org/2000/svg'>" +
        "<path d='M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z'/>" +
        "</svg></button></div></td>";
    } else {
      tr.innerHTML =
        "<td>" + n + "</td><td>" + s + "</td><td>" + en + "</td><td><div class='action-buttons'>" +
        "<button class='action-btn edit' onclick='edit(" + e.id + ")'>" +
        "<svg focusable='false' aria-hidden='true' viewBox='0 0 24 24'>" +
        "<path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/>" +
        "</svg></button>" +
        "<button class='action-btn delete' onclick='del(" + e.id + ")'>" +
        "<svg focusable='false' aria-hidden='true' viewBox='0 0 24 24' data-testid='DeleteIcon' aria-label='fontSize small'>" +
        "<path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'/>" +
        "</svg></button></div></td>";
    }

    tb.appendChild(tr);
  }
}

function addForm() {
  var tb = document.querySelector("#eventTable tbody");
  var old = document.querySelector(".add-row");
  if (old) old.remove();

  var tr = document.createElement("tr");
  tr.className = "add-row";
  tr.innerHTML =
    "<td><input type='text' id='newN' placeholder='Event name'></td>" +
    "<td><input type='date' id='newS'></td>" +
    "<td><input type='date' id='newE'></td>" +
    "<td><div class='action-buttons'>" +
    "<button class='action-btn save' onclick='add()'>" +
    "<svg focusable='false' aria-hidden='true' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>" +
    "<path d='M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z'/>" +
    "</svg></button>" +
    "<button class='action-btn cancel' onclick='cancelAdd()'>" +
    "<svg focusable='false' aria-hidden='true' viewBox='0 0 32 32' version='1.1' xmlns='http://www.w3.org/2000/svg'>" +
    "<path d='M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z'/>" +
    "</svg></button></div></td>";
  tb.appendChild(tr);
  document.getElementById("newN").focus();
}

function add() {
  var n = document.getElementById("newN").value.trim();
  var s = document.getElementById("newS").value;
  var e = document.getElementById("newE").value;

  console.log("add", n, s, e);

  if (!n || !s || !e) {
    alert("fill all");
    return;
  }

  fetch("http://localhost:3000/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: n, start: s, end: e }),
  })
    .then((r) => r.json())
    .then((d) => {
      console.log("added", d);
      cancelAdd();
      setTimeout(load, 100);
    })
    .catch((err) => {
      console.error("fail add", err);
      alert("add fail");
    });
}

function edit(id) {
  console.log("edit", id);
  for (var i = 0; i < events.length; i++) {
    events[i].editing = events[i].id == id;
  }
  draw();
}

function save(id) {
  var n = document.getElementById("n").value.trim();
  var s = document.getElementById("s").value;
  var e = document.getElementById("e").value;

  console.log("save", id, n, s, e);

  if (!n || !s || !e) {
    alert("fill all");
    return;
  }

  fetch("http://localhost:3000/events/" + id, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: n, start: s, end: e }),
  })
    .then((r) => r.json())
    .then((d) => {
      console.log("saved", d);
      setTimeout(load, 100);
    })
    .catch((err) => {
      console.error("fail save", err);
      alert("fail save");
    });
}

function cancel(id) {
  console.log("cancel", id);
  for (var i = 0; i < events.length; i++) {
    if (events[i].id == id) {
      events[i].editing = false;
    }
  }
  draw();
}

function del(id) {
  console.log("delete", id);
  if (confirm("sure?")) {
    fetch("http://localhost:3000/events/" + id, { method: "DELETE" })
      .then(() => {
        console.log("deleted");
        setTimeout(load, 100);
      })
      .catch((err) => {
        console.error("fail del", err);
        alert("fail delete");
      });
  }
}

function cancelAdd() {
  var add = document.querySelector(".add-row");
  if (add) add.remove();
}

document.getElementById("addEvent").onclick = addForm;
load();