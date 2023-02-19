var ids = getInputIDs();
var ssz = ids[0];
var inputRegi = [];

var gombDefault = '<button type="button" class="btn btn-primary" onclick="rowModButtons(this)">\
<i class="fa fa-pencil" aria-hidden="true">\
</i></button><button type="button" class="btn btn-danger" onclick="rowDel(this)">\
<i class="fa fa-trash" aria-hidden="true"></i>\
</button>'

var gombMod = '<button type="button" class="btn btn-success" onclick="rowModButtons(this)">\
<i class="fa fa-check" aria-hidden="true">\
</i></button><button type="button" class="btn btn-warning" onclick="rowModButtons(this)">\
<i class="fa fa-ban" aria-hidden="true"></i>\
</button>'

let fetchInitGet = {
    method: "GET",
    headers: new Headers(),
    mode: "cors",
    cache: "no-cache"
};

let fetchInitPost = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    mode: "cors",
    cache: "no-cache",
};

let fetchInitPatch = {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    mode: "cors",
    cache: "no-cache",
};

let fetchInitDelete = {
    method: "DELETE",
    headers: {"Content-Type": "application/json"},
    mode: "cors",
    cache: "no-cache"
};

leker();

function getInputIDs() {
    var inputObjects = document.querySelectorAll("table thead tr td input");
    var InputIDs = [];
    for (i of inputObjects) {
        InputIDs.push(i.id);
    };
    return InputIDs;
}

function kiolvas() {
    var inputs = {};
    for (i of getInputIDs()) {
        inputs[i]=document.querySelector("#"+i).value;
    };
    return inputs;
}

function deleteInputValues(){
    var inputKeys = getInputIDs();
    for (i of getInputIDs()){
        if ( i != inputKeys[0]){
            document.querySelector('input[id='+i+']').value = "";
        };
    };
}

function CheckInput() {
    var InputsFree = document.querySelectorAll(`table input:not([id=${ssz}])`);
    var InputValues = []
    for ( i of InputsFree ) {InputValues.push(i.value) }
    function Mind (val) { return val == ""}
    return InputValues.every(Mind);
}

function createGombok(tr){
    let tdGomb = document.createElement("td");
    tdGomb.setAttribute("class", "gombok");
    tdGomb.innerHTML = '<div class="btn-group" role="group" aria-label="Basic example">' + gombDefault + '</div>'
    tr.append(tdGomb);
}

function addRow() {
        if (CheckInput()) {
    } else {
        let newUser = kiolvas();
        delete newUser.Nr;
        addRowFetch(newUser);
        };
    }

function leker() {
    fetch("http://192.168.0.2:8080/users", fetchInitGet).then(
        data => data.json(),
        err => console.log(err)
        ).then(
        userek => {
            var ujSsz = userek[userek.length-1][ssz] + 1;
            document.querySelector("tbody").innerHTML="";
            createTable(userek, ujSsz)
        },
        err => console.error(err)
        )
}

function createTable(userek, ujSsz) {
    let tb = document.querySelector("table tbody");
    for ( i of userek ) {
        let tr = document.createElement("tr");
        tb.appendChild(tr);
        for (k in i){
            if (k == ssz) {
                let th = document.createElement("th");
                th.innerHTML = i[k];
                tr.insertBefore(th, tr.childNodes[0]);
                th.setAttribute("scope", "row");
            } else {
                let td = document.createElement("td");
                td.innerHTML = `<input type="text" class="form-control" placeholder=${k} value="${i[k]}" readonly style="background-color: unset"></input>`;
                tr.appendChild(td);
            };
        };
        createGombok(tr);
    };
    document.querySelector("#"+getInputIDs()[0]).value=ujSsz
}

function rowDel (gomb) {
    let selectedRow = gomb.parentElement.parentElement.parentElement;
    var sorszam = selectedRow.childNodes[0].innerHTML;
    selectedRow.parentElement.removeChild(selectedRow);
    rowDelFetch(sorszam)
}

function rowModButtons (gomb) {
    var gombdiv = gomb.parentElement;
    if (gomb.className == "btn btn-danger") {rowDel(gomb)
    } else {
        rowModInputFields(gombdiv, gomb)
    }
}

function rowModInputFields (gombdiv, gomb) {
    var ids = getInputIDs();
    var selectedRow = gombdiv.parentElement.parentElement;
    var sorszam = selectedRow.childNodes[0].innerHTML;
    var selectedRowInputFields = [];
    var selectedUser = {};
    selectedUser[ids[0]] = sorszam;
    for ( var i = 1; i <= 3; i++ ) {
        selectedUser[ids[i]] = selectedRow.children[i].children[0].value;
        selectedRowInputFields.push(selectedRow.children[i].children[0]);
    };
    if (gomb.className == "btn btn-primary") {
        inputRegi.push(selectedUser);
    }
    rowModInputFieldStyle (sorszam, selectedRowInputFields, selectedUser, ids, gombdiv, gomb)
}

function rowModInputFieldStyle (sorszam, selectedRowInputFields, selectedUser, ids, gombdiv, gomb) {
    if (gomb.className == "btn btn-primary") {
        for ( j of selectedRowInputFields ) {
            j.readOnly = false;
            j.setAttribute("style", "background-color: lightsteelblue")
        };
        gombdiv.innerHTML = gombMod;
        return
    } else {
        for ( k of selectedRowInputFields ) {
            k.readOnly = true;
            k.setAttribute("style", "background-color: unset")
        };
        gombdiv.innerHTML = gombDefault
    }
        rowModInputok(sorszam, selectedRowInputFields, selectedUser, ids, gombdiv, gomb)
    }
    
function rowModInputok (sorszam, selectedRowInputFields, selectedUser, ids, gombdiv, gomb) {
    var selectedUserIndex = inputRegi.findIndex( y => y[ids[0]] == sorszam);
    if (gomb.className == "btn btn-success") {
        var inputok = {};
        for ( var k = 1; k <= 3; k++ ) {
            inputok[ids[k]] = selectedRowInputFields[k-1].value
        };
        var gombokNodList = document.querySelectorAll("tbody button");
        var gombokArray = [];
        for ( i of gombokNodList) { gombokArray.push(i)};
        var gombWarning = gombokArray.find( z => z.className == "btn btn-warning");
        rowModFetch(sorszam, inputok, gombWarning);
        inputRegi.splice(selectedUserIndex, 1);
    }
    if (gomb.className == "btn btn-warning") {
        var talal = inputRegi.find( x => x[ids[0]] == sorszam);
        for (i in Object.keys(selectedRowInputFields)) {
            selectedRowInputFields[i].value = talal[ids[parseInt(i)+1]]
        };
        inputRegi.splice(selectedUserIndex, 1);
    }
}

function rowDelFetch (sorszam) {
    fetch(`http://192.168.0.2:8080/users/${sorszam}`, fetchInitDelete).then(
        resolve => resolve.json(),
        rejet => console.error(reject)
    ).then(
        data => console.log(data),
        err => console.error(err)
    )
}

function rowModFetch (sorszam, inputok, gombWarning) {
    fetchInitPatch.body= JSON.stringify(inputok);
    fetch(`http://192.168.0.2:8080/users/${sorszam}`, fetchInitPatch).then(
        resolve => resolve.json(),
        rejet => console.error(reject)
    ).then(
        data => {
            console.log("PATCH fetch ment:");
            console.log(data);
            if (gombWarning == undefined) {
                leker()};                
        },
        err => console.error(err)
    )
}

function addRowFetch (newUser) {
    fetchInitPost.body= JSON.stringify(newUser);
    fetch("http://192.168.0.2:8080/users", fetchInitPost).then(
        resolve => resolve.json(),
        rejet => console.error(reject)
    ).then(
        data => {
            console.log("POST fetch ment:");
            console.log(data);
            deleteInputValues();
            leker();
        },
        err => console.error(err)
    )
}