
window.onload=function(){

    async function fetchDataAndBuildTable(){
        // fetching the data(array of the object)
        const inputata=await fetch('data.json').then(d=>d.json());

        //creating header=['id','chemicalname'.....]
        const inputheaders=Object.keys(inputata[0]);

        //selecting a element where the table will get injected;
        const parentElement=document.getElementById("table1");

        //this is costructer for the creating 
        const t=new CustomTable(parentElement,inputata,inputheaders);
    };

    fetchDataAndBuildTable();

}

