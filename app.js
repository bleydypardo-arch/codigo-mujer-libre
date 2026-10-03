(() => {
"use strict";
// Paste the existing Supabase URL and publishable key from the current app.js before publishing.
// Never use a Supabase secret/service-role key in a browser app.
const SUPABASE_URL = "REPLACE_WITH_EXISTING_SUPABASE_URL";
const SUPABASE_KEY = "REPLACE_WITH_EXISTING_PUBLISHABLE_KEY";
const hasConfig = !SUPABASE_URL.startsWith("REPLACE_") && !SUPABASE_KEY.startsWith("REPLACE_");
const db = hasConfig && window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
let lang=localStorage.getItem("cml_lang")==="en"?"en":"es", step=1;

const choices={
 interests:["Social","Bienestar / Wellness","Fe / Faith","Aventura / Adventure","Familia / Family","Conexión / Connection","Apoyo / Support","Recargar / Recharge","Brunch / Café","Happy Hour","Restaurantes","Arte","Clases / Workshops","Ejercicio / Caminatas","Viajes","Música / Shows","Voluntariado","Actividades familiares"],
 days:["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"],
 times:["Mañana","Tarde","Noche"],
 activities:["Solo adultos","Con niños","Ambos"],
 travel:["Day trips","Fines de semana","Nacional","Internacional"],
 transport:["Puedo manejar","Necesito transporte","Puedo llevar a otras"],
 goals:["Hacer nuevas amigas","Salir más","Apoyo/comunidad","Crecimiento espiritual","Probar cosas nuevas","Viajar","Actividades familiares","Networking"],
 roles:["Participar","Organizar","Dar la bienvenida"]
};
function renderChoices(){
 const map={interestChoices:"interests",dayChoices:"days",timeChoices:"times",activityChoices:"activities",travelChoices:"travel",transportChoices:"transport",goalChoices:"goals",roleChoices:"roles"};
 Object.entries(map).forEach(([id,key])=>{
  $("#"+id).innerHTML=choices[key].map(v=>`<label class="choice"><input type="checkbox" name="${key}" value="${v}">${v}</label>`).join("");
 });
}
const words={
 es:{tag:"Conecta · Vive · Crece",welcome:"Tu comunidad para hacer planes y conectar.",desc:"Descubre actividades, conoce mujeres y organiza planes juntas.",create:"Crear cuenta",have:"Ya tengo cuenta",login:"Entrar",back:"Volver",next:"Continuar",prev:"Anterior",finish:"Crear mi cuenta"},
 en:{tag:"Connect · Live · Grow",welcome:"Your community to make plans and connect.",desc:"Discover activities, meet women and make plans together.",create:"Create account",have:"I already have an account",login:"Log in",back:"Back",next:"Continue",prev:"Previous",finish:"Create my account"}
};
function setLang(l){
 lang=l; localStorage.setItem("cml_lang",l); const w=words[l];
 $("#authTag").textContent=w.tag; $("#welcomeTitle").textContent=w.welcome; $("#welcomeText").textContent=w.desc;
 $("#createAccount").textContent=w.create; $("#showLogin").textContent=w.have; $("#loginTitle").textContent=w.login; $("#loginBtn").textContent=w.login;
 $$(".back span").forEach(x=>x.textContent=w.back); $("#nextStep").textContent=w.next; $("#prevStep").textContent=w.prev; $("#finishSignup").textContent=w.finish;
 $("#authLang").textContent=l==="es"?"EN":"ES"; $("#langBtn").textContent=l==="es"?"EN":"ES";
}
function pane(id){["welcomePane","loginPane","signupPane"].forEach(x=>$("#"+x).hidden=x!==id)}
function showStep(n){
 step=Math.max(1,Math.min(4,n)); $$(".qstep").forEach(s=>s.hidden=Number(s.dataset.step)!==step);
 $("#stepLabel").textContent=(lang==="es"?"Paso ":"Step ")+step+(lang==="es"?" de 4":" of 4"); $("#progressBar").style.width=(step*25)+"%";
 $("#prevStep").hidden=step===1; $("#nextStep").hidden=step===4; $("#finishSignup").hidden=step!==4; window.scrollTo(0,0);
}
function selected(name){return $$(`input[name="${name}"]:checked`).map(x=>x.value)}
function profileData(form){
 const fd=new FormData(form);
 return {display_name:fd.get("display_name"),phone:fd.get("phone"),area:fd.get("area"),age_range:fd.get("age_range"),travel_minutes:fd.get("travel_minutes"),
 interests:selected("interests"),favorite_foods:fd.get("favorite_foods"),dietary:fd.get("dietary"),days:selected("days"),times:selected("times"),budget:fd.get("budget"),
 activities:selected("activities"),kids_ages:fd.get("kids_ages"),travel:selected("travel"),transport:selected("transport"),available_seats:fd.get("available_seats")||0,
 goals:selected("goals"),roles:selected("roles"),pilot_privacy_accepted:true};
}
function enterApp(){ $("#authGate").hidden=true; $("#appShell").hidden=false; }
function leaveApp(){ $("#appShell").hidden=true; $("#authGate").hidden=false; pane("welcomePane"); }
$("#createAccount").onclick=()=>{pane("signupPane");showStep(1)};
$("#showLogin").onclick=()=>pane("loginPane");
$$("[data-back=welcome]").forEach(b=>b.onclick=()=>pane("welcomePane"));
$("#authLang").onclick=()=>setLang(lang==="es"?"en":"es"); $("#langBtn").onclick=()=>setLang(lang==="es"?"en":"es");
$("#nextStep").onclick=()=>{const section=$(`.qstep[data-step="${step}"]`);const bad=section.querySelector(":invalid");if(bad){bad.reportValidity();return}showStep(step+1)};
$("#prevStep").onclick=()=>showStep(step-1);

$("#signupPane").addEventListener("submit",async e=>{
 e.preventDefault(); const fb=$("#signupFeedback"); fb.textContent="";
 if(!e.target.privacy.checked){fb.textContent=lang==="es"?"Debes aceptar la privacidad del piloto.":"Please accept the pilot privacy notice.";return}
 if(!db){fb.textContent="Versión de prueba: falta insertar la configuración pública existente de Supabase.";return}
 const fd=new FormData(e.target), email=fd.get("email"), password=fd.get("password"), profile=profileData(e.target);
 const {data,error}=await db.auth.signUp({email,password,options:{data:profile}});
 if(error){fb.textContent=error.message;return}
 if(data.session){enterApp()}else{fb.textContent=lang==="es"?"Cuenta creada. Revisa tu email para confirmar y luego entra.":"Account created. Check your email to confirm, then log in.";pane("loginPane")}
});
$("#loginPane").addEventListener("submit",async e=>{
 e.preventDefault(); const fb=$("#loginFeedback");fb.textContent="";
 if(!db){fb.textContent="Versión de prueba: falta insertar la configuración pública existente de Supabase.";return}
 const {error}=await db.auth.signInWithPassword({email:$("#loginEmail").value.trim(),password:$("#loginPassword").value});
 if(error){fb.textContent=error.message;return} enterApp();
});
$("#logoutBtn").onclick=async()=>{if(db)await db.auth.signOut();leaveApp()};
$$("nav button[data-page]").forEach(b=>b.onclick=()=>{$$(".page").forEach(p=>p.classList.toggle("active",p.id===b.dataset.page));window.scrollTo(0,0)});
renderChoices();setLang(lang);showStep(1);
(async()=>{if(db){const {data}=await db.auth.getSession();if(data.session)enterApp()}})();
})();