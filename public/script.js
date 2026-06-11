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

document.getElementById("y15count").innerText = votes.Y15ZR+" undi";
document.getElementById("rscount").innerText = votes.RS150R+" undi";
document.getElementById("rxzcount").innerText = votes.RXZ+" undi";

let y15 = total ? votes.Y15ZR/total*100 : 0;
let rs = total ? votes.RS150R/total*100 : 0;
let rxz = total ? votes.RXZ/total*100 : 0;

document.getElementById("barY15").style.width = y15+"%";
document.getElementById("barRS").style.width = rs+"%";
document.getElementById("barRXZ").style.width = rxz+"%";

document.getElementById("y15percent").innerText = y15.toFixed(1)+"%";
document.getElementById("rspercent").innerText = rs.toFixed(1)+"%";
document.getElementById("rxzpercent").innerText = rxz.toFixed(1)+"%";

}

update();
