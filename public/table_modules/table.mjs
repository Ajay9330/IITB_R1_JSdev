import Overlay from "./overlay_modules/overlay.mjs";

const controlImg = [
    { name: 'edit', value: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>` },
    { name: 'add', value: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>` },
    { name: 'down', value: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z"/></svg>` },
    { name: 'up', value: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/></svg>` },
    { name: 'delete', value: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>` },
    { name: 'refresh', value: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/></svg>` },    
    { name: 'save', value: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/></svg>` }
];

class CustomTable {
    selectedColumn = -1;
    selectedRows = {};
    selectedRowsCount=0;
    overlay = new Overlay()
    
    constructor(parentElement, inputata, headers) {
        this.headers = headers;
        this.data = this.cleanData(inputata);
        this.originalData = this.data;
        this.setupStructure();

        this.data.forEach(item => {
            this.selectedRows[item.tableRowId] = false;
        });
        this.addClasses();
        this.setupControls();
        parentElement.appendChild(this.mainTablewrapper);
        this.renderTableHead();
        this.renderTableBody();
    }
    reset() {
        this.selectedRowsCount=0;
        this.data = this.originalData;
        this.selectedColumn = -1;
        this.data.forEach(item => {
            this.selectedRows[item.tableRowId] = false;
        });
        this.renderTableHead()
        this.renderTableBody()
        this.sortTable('id')
    }
    cleanData(data) {
        let cleanedData = data.map((x, idx) => {
            let temObj = {};
            for (let i of this.headers) {
                temObj[i] = x[i] || "N/A";
            }
            temObj["tableRowId"] = idx;
            return temObj;
        });
        return cleanedData;
    }
    setupStructure() {
        this.mainTablewrapper = document.createElement('div');
        this.controls = document.createElement('div');
        this.tableWrapper = document.createElement('div');
        this.dataTable = document.createElement('table');
        let t = document.createElement('thead');
        this.tableHead = document.createElement('tr');
        t.appendChild(this.tableHead);
        this.tableBody = document.createElement('tbody');
        this.dataTable.append(t);
        this.dataTable.append(this.tableBody);
        this.tableWrapper.append(this.dataTable)
        this.mainTablewrapper.appendChild(this.controls);
        this.mainTablewrapper.append(this.tableWrapper);
        controlImg.forEach(e => {
            const child = document.createElement('span');
            child.innerHTML = e.value;
            child.setAttribute("data-name", e.name);
            this.controls.appendChild(child)
        })
    }
    addClasses() {
        this.mainTablewrapper.classList.add('main-table-wrapper');
        this.controls.classList.add('controls');
        this.tableWrapper.classList.add('table-wrapper');
        this.dataTable.classList.add('datatable');
    }
    setupControls() {
        Array.from(this.controls.children).forEach(child => {
            this.mapControls(child, child.dataset.name);
        });
    }
    mapControls(elem, eventType) {
        if (eventType == 'up') {
            elem.addEventListener('click', () => {
                this.sortTable(this.selectedColumn, true);
            });
        } else if (eventType == 'down') {
            elem.addEventListener('click', () => {
                this.sortTable(this.selectedColumn);
            })
        } else if (eventType == 'edit') {
            elem.addEventListener('click', () => {
                if(this.selectedRowsCount>1){
                    this.overlay.showPopup("Please Select only 1 single row for edit");
                    return;
                }
                let selecteIndex=-1;
                this.data.forEach((x,i)=>{
                    if(this.selectedRows[x.tableRowId]===true){
                        selecteIndex=i;
                    }
                });
                if(selecteIndex==-1){
                    this.overlay.showPopup("Please Select a row for edit");
                    return;
                }
                let selectedRow = this.data[selecteIndex];
                if (selectedRow) {
                    this.overlay.getEditResponse("Edit Item", selectedRow, (response) => {
                        this.data[selecteIndex]=response;
                        this.renderTableBody();
                    });
                }
            });

        } else if (eventType == 'add') {
            elem.addEventListener('click', () => {
               
                this.overlay.getAddResponse("Add New Item", this.headers, (response) => {
                    response["tableRowId"]=String(Math.random()*1000);
                    this.headers.forEach(head=>{
                      response[head]=response[head]||"N/A"
                    })
                    this.selectedRows[response.tableRowId]=false
                    this.data.push(response);
                    this.renderTableBody();
                });
            });

        } else if (eventType == 'delete') {
            elem.addEventListener('click', () => {
                if(this.selectedRowsCount==0){
                    this.overlay.showPopup("Please select rows to delete");
                    return;
                }
                this.overlay.getConfirmation(`Do you want to Delete ${this.selectedRowsCount} rows`,"Yes","No",()=>this.deleteSelectedRows());
            })
        } else if (eventType == 'refresh') {
            elem.addEventListener('click', () => {
                this.reset();
            })
        } else if (eventType == 'save') {
            elem.addEventListener('click',()=>{
                this.overlay.showPopup("Data Saved. in this callback you can pass the function to save data on some endpoints")
            })
        } else {
            console.error("control event not mached");
        }

    }
    sortTable(headerIndex, desc) {
        if (headerIndex == -1) {
            this.overlay.showPopup("Please select a column by click on header");
            return;
        }
        const v = this.headers[headerIndex];
        this.data.sort((data1, data2) => {
            const value1 = data1[v];
            const value2 = data2[v];

            if (value1 === 'N/A' && value2 === 'N/A') return 0;
            if (value1 === 'N/A') return desc ? 1 : -1;
            if (value2 === 'N/A') return desc ? -1 : 1;

            const isNum1 = !isNaN(value1);
            const isNum2 = !isNaN(value2);

            if (isNum1 && isNum2) {
                return desc ? Number(value2) - Number(value1) : Number(value1) - Number(value2);
            } else {
                if (value1 < value2) return desc ? 1 : -1;
                if (value1 > value2) return desc ? -1 : 1;
                return 0;
            }
        });
        this.selectColumn(this.selectedColumn);
        this.renderTableBody();
    }


    selectColumn(index) {
        let headerChild = Array.from(this.tableHead.children);
        headerChild[index + 1].classList.toggle('active');
        if (this.selectedColumn != -1) {
            if (this.selectedColumn == index) {
                this.selectedColumn = -1;
            } else {
                headerChild[this.selectedColumn + 1].classList.toggle('active');
                this.selectedColumn = index;
            }

        } else {
            this.selectedColumn = index;
        }
    }
    toggleRowSelection(id, elem) {
        if (this.selectedRows.hasOwnProperty(id)) {
            if(this.selectedRows[id]==true){
                this.selectedRowsCount--;
            }else{
                this.selectedRowsCount++;
            }
            this.selectedRows[id] = Boolean(!this.selectedRows[id]);
            elem.parentElement.parentElement.classList.toggle('activeRow');
        }

    }
    deleteSelectedRows() {
        let selected = Object.keys(this.selectedRows).filter(key => this.selectedRows[key]);
        if (selected.length == 0) {
            this.overlay.showPopup("Select one or more rows to delete")
            return;
        }
        this.data = this.data.filter(obj => this.selectedRows[obj.tableRowId] === false);
        selected.forEach(key => {
            delete this.selectedRows[key];
        })

        Array.from(this.tableBody.children).forEach(elem => {
            if (elem.classList.contains('activeRow')) {
                elem.remove();
            }
        })
        this.selectedRowsCount=0;
    }
    renderTableHead() {
        this.tableHead.innerHTML = '';
        let select = document.createElement('th');
        select.innerText = "";
        this.tableHead.appendChild(select);
        this.headers.forEach((headerVal, index) => {
            const th = document.createElement('th');
            th.innerText = headerVal;
            th.addEventListener('click', () => {
                this.selectColumn(index);
            });
            this.tableHead.appendChild(th);
        })
    }
    renderTableBody() {
        let selectBtn = this.data.map(x => {
            let i = document.createElement('input');
            i.setAttribute('type', 'checkbox');
            i.checked = this.selectedRows[x.tableRowId];
            i.id = x.tableRowId;
            i.addEventListener('click', () => this.toggleRowSelection(x.tableRowId, i));
            return i;
        })
        this.tableBody.innerHTML = "";


        this.data.forEach((x, i) => {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.append(selectBtn[i])
            tr.appendChild(td);
            for (let i = 0; i < this.headers.length; i++) {
                let td = document.createElement('td');
                td.innerText = x[this.headers[i]];
                tr.appendChild(td);
            }
            this.tableBody.append(tr);
            if (this.selectedRows[x.tableRowId] === true) {
                tr.classList.add('activeRow');
            }
        })
    }

}

//attaching the Constructers to window object for global access
window.CustomTable = CustomTable;
window.Overlay = Overlay;


