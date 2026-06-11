let votes = {
  Y15ZR: 0,
  RS150R: 0,
  RXZ: 0
};

function vote(type){
  votes[type]++;
  update();
}

function update(){

let total = votes.Y15ZR + votes.RS150R + votes.RXZ;

document.getElementById("y15count").innerText = votes.Y15ZR + " Undi";
document.getElementById("rscount").innerText = votes.RS150R + " Undi";
document.getElementById("rxzcount").innerText = votes.RXZ + " Undi";

let y15 = total ? votes.Y15ZR/total*100 : 0;
let rs = total ? votes.RS150R/total*100 : 0;
let rxz = total ? votes.RXZ/total*100 : 0;

document.getElementById("y15percent").innerText = y15.toFixed(1)+"%";
document.getElementById("rspercent").innerText = rs.toFixed(1)+"%";
document.getElementById("rxzpercent").innerText = rxz.toFixed(1)+"%";

let ranking = Object.entries(votes).sort((a,b)=>b[1]-a[1]);

document.getElementById("ranking").innerHTML =
ranking.map((v,i)=>`
<p>${["🥇","🥈","🥉"][i]} ${v[0]} - ${v[1]}</p>
`).join("");

}

update();
