const supabaseUrl = "https://tdhtiaswonkqvqcgidem.supabase.co";
const supabaseKey = "ISI_ANON_KEY_KAU";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let user = null;

console.log("MotoVote app loaded");

// =========================
// 🔐 AUTH SYSTEM (FIXED)
// =========================

// ambil session awal
async function initAuth() {
  const { data } = await supabase.auth.getSession();
  user = data.session?.user || null;
  console.log("Session awal:", user);
}

initAuth();

// listen perubahan login/logout
supabase.auth.onAuthStateChange((event, session) => {
  user = session?.user || null;
  console.log("Auth changed:", event, user);
});

// =========================
// 🔑 LOGIN GOOGLE
// =========================

async function login() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin
    }
  });

  if (error) {
    console.log("Login error:", error.message);
  }
}

// =========================
// 📦 LOAD VOTES
// =========================

async function load() {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("id", "main")
    .single();

  if (error) {
    console.log("Load votes error:", error.message);
    return;
  }

  updateUI(data);
}

// =========================
// 🎨 UPDATE UI
// =========================

function updateUI(d) {
  let total = (d.y15zr + d.rs150r + d.rxz) || 1;

  document.getElementById("y15").innerText = d.y15zr;
  document.getElementById("rs").innerText = d.rs150r;
  document.getElementById("rxz").innerText = d.rxz;

  document.getElementById("bar1").style.width = (d.y15zr / total * 100) + "%";
  document.getElementById("bar2").style.width = (d.rs150r / total * 100) + "%";
  document.getElementById("bar3").style.width = (d.rxz / total * 100) + "%";
}

// =========================
// 🗳️ VOTE SYSTEM (ANTI DUPLICATE)
// =========================

async function vote(type) {

  console.log("Vote clicked:", type);
  console.log("Current user:", user);

  if (!user) {
    alert("Sila login Google dulu");
    return;
  }

  // 🔍 check user pernah vote atau belum
  const { data: existing, error: checkError } = await supabase
    .from("user_votes")
    .select("*")
    .eq("user_id", user.id);

  if (checkError) {
    console.log("Check vote error:", checkError.message);
    return;
  }

  if (existing && existing.length > 0) {
    alert("Kau dah vote sebelum ni");
    return;
  }

  // 📦 ambil data votes
  const { data: v, error: loadError } = await supabase
    .from("votes")
    .select("*")
    .eq("id", "main")
    .single();

  if (loadError || !v) {
    console.log("Load vote error:", loadError?.message);
    return;
  }

  // 🧠 update vote
  v[type] = (v[type] || 0) + 1;

  // 💾 simpan ke database
  const { error: updateError } = await supabase
    .from("votes")
    .update(v)
    .eq("id", "main");

  if (updateError) {
    console.log("Update vote error:", updateError.message);
    return;
  }

  // 🧾 simpan user vote
  const { error: insertError } = await supabase
    .from("user_votes")
    .insert({
      user_id: user.id,
      vote_type: type
    });

  if (insertError) {
    console.log("Insert user vote error:", insertError.message);
    return;
  }

  console.log("Vote success!");
  load();
}

// =========================
// 🚀 INIT APP
// =========================

load();
