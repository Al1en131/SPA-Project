var v=n=>{throw TypeError(n)};var y=(n,e,t)=>e.has(n)||v("Cannot "+t);var i=(n,e,t)=>(y(n,e,"read from private field"),t?t.call(n):e.get(n)),m=(n,e,t)=>e.has(n)?v("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(n):e.set(n,t),p=(n,e,t,r)=>(y(n,e,"write to private field"),r?r.call(n,t):e.set(n,t),t),b=(n,e,t)=>(y(n,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const h={BASE_URL:"https://story-api.dicoding.dev/v1"};async function S(n,e,t){try{const r=await fetch(`${h.BASE_URL}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:n,email:e,password:t})}),s=await r.json();if(!r.ok)throw new Error(s.message);return s}catch(r){return console.error("Error registering:",r),null}}async function P(n,e){try{const t=await fetch(`${h.BASE_URL}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,password:e})}),r=await t.json();if(!t.ok)throw new Error(r.message);return localStorage.setItem("token",r.loginResult.token),r.loginResult}catch(t){return console.error("Error logging in:",t),null}}async function k(){const n=localStorage.getItem("token");if(!n)return alert("Anda harus login terlebih dahulu!"),[];try{const t=await(await fetch(`${h.BASE_URL}/stories`,{method:"GET",headers:{Authorization:`Bearer ${n}`}})).json();return t.error?(console.error("Gagal mengambil data:",t.message),[]):t.listStory||[]}catch(e){return console.error("Error fetching stories:",e),[]}}async function B(n,e,t,r,s){const a=localStorage.getItem("token");if(!a)return alert("Anda harus login terlebih dahulu!"),null;const o=new FormData;o.append("description",e),o.append("photo",t),r&&s&&(o.append("lat",parseFloat(r)),o.append("lon",parseFloat(s)));try{return await(await fetch(`${h.BASE_URL}/stories`,{method:"POST",body:o,headers:{Authorization:`Bearer ${a}`}})).json()}catch(w){return console.error("Error adding story:",w),null}}class I{constructor(e){this.view=e,this.selectedLat=null,this.selectedLon=null}init(){this.setupCamera(),this.setupMap(),this.setupForm()}setupCamera(){const e=document.getElementById("camera"),t=document.getElementById("canvas"),r=document.getElementById("photo-preview"),s=document.getElementById("capture-btn");navigator.mediaDevices.getUserMedia({video:!0}).then(a=>{e.srcObject=a,this.cameraStream=a}),s.addEventListener("click",()=>{const a=t.getContext("2d");t.width=e.videoWidth,t.height=e.videoHeight,a.drawImage(e,0,0,t.width,t.height),r.src=t.toDataURL("image/png"),r.style.display="block",this.stopCamera()})}stopCamera(){this.cameraStream&&this.cameraStream.getTracks().forEach(e=>e.stop())}setupMap(){const e=L.map("map").setView([-2.5489,118.0149],5);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}).addTo(e);let t;e.on("click",r=>{t&&t.remove(),t=L.marker([r.latlng.lat,r.latlng.lng]).addTo(e),document.getElementById("latlon").innerText=`Lokasi: ${r.latlng.lat}, ${r.latlng.lng}`,this.selectedLat=r.latlng.lat,this.selectedLon=r.latlng.lng})}setupForm(){document.getElementById("add-story-form").addEventListener("submit",async e=>{e.preventDefault();const t=document.getElementById("name").value,r=document.getElementById("description").value,s=document.getElementById("canvas");if(!this.selectedLat||!this.selectedLon){this.view.displayMessage("Pilih lokasi di peta!");return}s.toBlob(async a=>{const o=await B(t,r,a,parseFloat(this.selectedLat),parseFloat(this.selectedLon));this.view.displayMessage(o.message),o.error||this.view.navigateToStoryList()},"image/png")})}}class M{constructor(){this.presenter=new I(this)}async render(){return`
      <main id="main-content" class="main-content" tabindex="0">
        <h2>Tambah Story</h2>
        <form id="add-story-form">
            <label for="name">Nama:</label>
            <input type="text" id="name" required>

            <label for="description">Deskripsi:</label>
            <textarea id="description" rows="5" required></textarea>

            <label>Foto:</label>
            <video id="camera" autoplay></video>
            <button type="button" id="capture-btn">Ambil Foto</button>
            <canvas id="canvas" style="display:none;"></canvas>
            <img id="photo-preview" style="display:none;" alt="Preview Foto">

            <label>Lokasi:</label>
            <div id="map" style="height: 300px;"></div>
            <p id="latlon">Klik di peta untuk memilih lokasi.</p>

            <button type="submit">Tambah Story</button>
            <p id="message"></p>
        </form>
      </main>
    `}async afterRender(){this.presenter.init()}displayMessage(e){document.getElementById("message").textContent=e}navigateToStoryList(){alert("Story berhasil ditambahkan!"),window.location.hash="#story"}}class R{constructor(e){this.view=e}init(){this.setupForm()}setupForm(){document.getElementById("login-form").addEventListener("submit",async e=>{e.preventDefault();const t=document.getElementById("email").value,r=document.getElementById("password").value;if(!this.validateEmail(t)){this.view.displayMessage("Email tidak valid!");return}const s=await P(t,r);s?(this.view.displayMessage("Login berhasil!",!0),this.view.navigateToStoryPage(s.name)):this.view.displayMessage("Login gagal! Periksa kembali email dan password.")})}validateEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}}class T{constructor(){this.presenter=new R(this)}async render(){return`
      <main id="main-content" class="main-content" tabindex="0">
          <h1 class="title">Login</h1>
          <form id="login-form">
              <label for="email">Email:</label>
              <input type="email" id="email" placeholder="Email" required>

              <label for="password">Password:</label>
              <input type="password" id="password" placeholder="Password" required>

              <button type="submit">Login</button>
          </form>
          <p id="message"></p>
          <p>Don't have an account? <a href="#register">Register here</a></p>
      </main>
    `}async afterRender(){this.presenter.init()}displayMessage(e,t=!1){const r=document.getElementById("message");r.textContent=e,r.style.color=t?"green":"red"}navigateToStoryPage(e){alert(`Login successful! Welcome, ${e}`),window.location.hash="#story"}}class x{constructor(e){this.view=e}init(){this.setupForm()}setupForm(){document.getElementById("register-form").addEventListener("submit",async e=>{e.preventDefault();const t=document.getElementById("name").value,r=document.getElementById("email").value,s=document.getElementById("password").value;if(!this.validateEmail(r)){this.view.displayMessage("Email tidak valid!");return}if(s.length<6){this.view.displayMessage("Password harus minimal 6 karakter!");return}await S(t,r,s)?(this.view.displayMessage("Registrasi berhasil!",!0),this.view.navigateToLoginPage()):this.view.displayMessage("Registrasi gagal! Coba lagi.")})}validateEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}}class A{constructor(){this.presenter=new x(this)}async render(){return`
      <main id="main-content" class="main-content" tabindex="0">
          <h1 class="title">Register</h1>
          <form id="register-form">
              <label for="name">Name:</label>
              <input type="text" id="name" placeholder="Name" required>

              <label for="email">Email:</label>
              <input type="email" id="email" placeholder="Email" required>

              <label for="password">Password:</label>
              <input type="password" id="password" placeholder="Password" required>

              <button type="submit">Register</button>
          </form>
          <p id="message"></p>
          <p>Already have an account? <a href="#login">Login here</a></p>
      </main>
    `}async afterRender(){this.presenter.init()}displayMessage(e,t=!1){const r=document.getElementById("message");r.textContent=e,r.style.color=t?"green":"red"}navigateToLoginPage(){alert("Registration successful! Please login."),window.location.hash="#login"}}const D="StoryAppDB",O=1,c="stories",f=()=>new Promise((n,e)=>{const t=indexedDB.open(D,O);t.onupgradeneeded=r=>{const s=r.target.result;s.objectStoreNames.contains(c)||s.createObjectStore(c,{keyPath:"id",autoIncrement:!0})},t.onsuccess=()=>n(t.result),t.onerror=()=>e(t.error)}),$=async n=>{const e=await f();return new Promise((t,r)=>{const o=e.transaction(c,"readwrite").objectStore(c).add(n);o.onsuccess=()=>t(o.result),o.onerror=()=>r(o.error)})},q=async()=>{const n=await f();return new Promise((e,t)=>{const a=n.transaction(c,"readonly").objectStore(c).getAll();a.onsuccess=()=>e(a.result),a.onerror=()=>t(a.error)})},F=async n=>{const e=await f();return new Promise((t,r)=>{const o=e.transaction(c,"readwrite").objectStore(c).delete(n);o.onsuccess=()=>t(),o.onerror=()=>r(o.error)})};let C=class{constructor(e){this.view=e}async loadStories(){const e=await q();this.view.displayStories(e)}async addStory(e){await $({content:e}),this.loadStories(),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.controller.postMessage({type:"NEW_STORY",message:"Story berhasil disimpan!"})}async deleteStory(e){await F(e),this.loadStories()}};class N{constructor(){this.presenter=new C(this)}async render(){return`
      <main id="main-content" class="main-content" tabindex="0">
          <h1 class="title">Daftar Story</h1>
          <form id="story-form">
              <input type="text" id="story-input" placeholder="Write your story..." required />
              <button type="submit">Save</button>
          </form>
          <section id="story-list" aria-live="polite"></section>
      </main>
    `}async afterRender(){this.setupEventListeners(),this.presenter.loadStories()}setupEventListeners(){document.getElementById("story-form").addEventListener("submit",e=>{e.preventDefault();const t=document.getElementById("story-input"),r=t.value.trim();r&&(this.presenter.addStory(r),t.value="")})}displayStories(e){const t=document.getElementById("story-list");t.innerHTML="",e.forEach(r=>{const s=document.createElement("div");s.className="story-item",s.innerHTML=`
        <p style="margin-bottom: 10px;">${r.content}</p>
        <button class="delete-btn" data-id="${r.id}">Delete</button>
      `,t.appendChild(s)}),document.querySelectorAll(".delete-btn").forEach(r=>{r.addEventListener("click",s=>{const a=parseInt(s.target.dataset.id,10);this.presenter.deleteStory(a)})})}}class j{constructor(e){this.view=e}async loadStories(){const e=await k();this.view.displayStories(e)}loadMap(e){const t=L.map("map").setView([-2.5489,118.0149],5);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}).addTo(t),e.forEach(r=>{r.lat&&r.lon&&L.marker([r.lat,r.lon]).addTo(t).bindPopup(`<b>${r.name}</b><br>${r.description}`).openPopup()})}}class W{constructor(){this.presenter=new j(this)}async render(){return`
      <main id="main-content" class="main-content" tabindex="0">
          <h1 class="title">Daftar Story</h1>
          <button id="add-story-btn">+ Add Story</button>
          <section id="story-list" aria-live="polite"></section>
          <section id="map-container">
              <h2>Peta Lokasi</h2>
              <div id="map" style="height: 300px;"></div>
          </section>
      </main>
    `}async afterRender(){this.setupEventListeners(),this.presenter.loadStories()}setupEventListeners(){document.getElementById("add-story-btn").addEventListener("click",()=>{window.location.hash="#/add"})}displayStories(e){const t=document.getElementById("story-list");t.innerHTML="",e.forEach(r=>{const s=document.createElement("div");s.className="story-item",s.innerHTML=`
        <img src="${r.photoUrl}" alt="Foto dari ${r.name}" class="story-image">
        <h3>${r.name}</h3>
        <p>${r.description}</p>
        <p>Created at ${r.createdAt}</p>
      `,t.appendChild(s)}),this.presenter.loadMap(e)}}const _={"/add":new M,"/login":new T,"/register":new A,"/":new W,"/story":new N};function H(n){const e=n.split("/");return{resource:e[1]||null,id:e[2]||null}}function U(n){let e="";return n.resource&&(e=e.concat(`/${n.resource}`)),n.id&&(e=e.concat("/:id")),e||"/"}function V(){return location.hash.replace("#","")||"/"}function z(){const n=V(),e=H(n);return U(e)}var d,u,l,g,E;class K{constructor({navigationDrawer:e,drawerButton:t,content:r}){m(this,g);m(this,d,null);m(this,u,null);m(this,l,null);p(this,d,r),p(this,u,t),p(this,l,e),b(this,g,E).call(this)}async renderPage(){const e=z(),t=_[e];if(!document.startViewTransition){i(this,d).innerHTML=await t.render(),await t.afterRender();return}document.startViewTransition(async()=>{i(this,d).innerHTML=await t.render(),await t.afterRender()})}}d=new WeakMap,u=new WeakMap,l=new WeakMap,g=new WeakSet,E=function(){i(this,u).addEventListener("click",()=>{i(this,l).classList.toggle("open")}),document.body.addEventListener("click",e=>{!i(this,l).contains(e.target)&&!i(this,u).contains(e.target)&&i(this,l).classList.remove("open"),i(this,l).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&i(this,l).classList.remove("open")})})};document.addEventListener("DOMContentLoaded",async()=>{const n=new K({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await n.renderPage(),window.addEventListener("hashchange",async()=>{await n.renderPage()})});"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(n=>{console.log("Service Worker registered:",n),"PushManager"in window&&Notification.requestPermission().then(e=>{e==="granted"&&n.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:"BD_bF-KraJi7-WVrHZqzQdo5WiRHVPARci6K_RU9ooBTfyVrioqmVlc4EgRP8i7NI4G-bFfOEbx48Tn2kiE6kOk"}).then(t=>{console.log("Push Subscription:",t)}).catch(t=>console.error("Push Subscription failed:",t))})}).catch(n=>console.error("Service Worker registration failed:",n))});
