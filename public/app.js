const supabaseUrl = "https://tdhtiaswonkqvqcgidem.supabase.co";
const supabaseKey = "ISI_ANON_KEY_KAU";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let user = null;

// LOGIN GOOGLE
async function login(){
  await supabase.auth.signInWithOAuth({
    provider: "google"
  });
}

// GET USER
supabase.auth.getUser().then(res=>{
  user = res.data.user;
});

// LOAD VOTES
async function load(){
  let { data } = await supabase
    .from("votes")
    .select("*")
    .eq("id","main")
    .single();

  updateUI(data);
}

// UPDATE UI
function updateUI(d){

let total = d.y15zr + d.rs150r + d.rxz;

document.getElementById("y15").innerText = d.y15zr;
document.getElementById("rs").innerText = d.rs150r;
document.getElementById("rxz").innerText = d.rxz;

document.getElementById("bar1").style.width = (d.y15zr/total*100||0)+"%";
document.getElementById("bar2").style.width = (d.rs150r/total*100||0)+"%";
document.getElementById("bar3").style.width = (d.rxz/total*100||0)+"%";
}

// VOTE SYSTEM
async function vote(type){

if(!user){
  alert("Login dulu");
  return;
}

// check duplicate vote
let { data } = await supabase
  .from("user_votes")
  .select("*")
  .eq("user_id", user.id)
  .single();

if(data){
  alert("Kau dah vote");
  return;
}

// get votes
let { data: v } = await supabase
  .from("votes")
  .select("*")
  .eq("id","main")
  .single();

v[type]++;

// update votes
await supabase
  .from("votes")
  .update(v)
  .eq("id","main");

// save user vote
await supabase
  .from("user_votes")
  .insert({
    user_id: user.id,
    vote_type: type
  });

load();
}

load();
