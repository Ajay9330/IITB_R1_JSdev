
window.onload=function(){
    // alert("h")
    async function fetchDataAndBuildTable(){
        const inputata=await fetch('data.json').then(d=>d.json());
        console.log(inputata)
        const inputheaders=Object.keys(inputata[0]);
        const parentElement=document.getElementById("table1");

        const t=new CustomTable(parentElement,inputata,inputheaders);
    };
    fetchDataAndBuildTable();

 
}


    // overlay.getEditResponse('Please edit your details:', [
    //     { name: 'Name' },
    //     { name: 'Class' }
    // ]);


// Example for confirmation
    // overlay.getConfirmation('Are you sure you want to proceed?');

