
window.onload=function(){
    async function fetchDataAndBuildTable(){
        const inputata=await fetch('data.json').then(d=>d.json());
        console.log(inputata)
        const inputheaders=Object.keys(inputata[0]);
        const parentElement=document.getElementById("table1");

        const t=new CustomTable(parentElement,inputata,inputheaders);
    };
    fetchDataAndBuildTable();


}

