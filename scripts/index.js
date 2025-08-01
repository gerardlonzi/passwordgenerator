const nationalities = {
  AU: 'Australia', BR: 'Brazil', CA: 'Canada', CH: 'Switzerland', DE: 'Germany', DK: 'Denmark',
  ES: 'Spain', FI: 'Finland', FR: 'France', GB: 'United Kingdom', IE: 'Ireland', IR: 'Iran',
  NO: 'Norway', NL: 'Netherlands', NZ: 'New Zealand', TR: 'Turkey', US: 'United States'
};

const translations = {
  fr: {
    title_website: "Générateur d'identités temporaires | Générateur de nom temporaire et aléatoire",
    title: "Générateur d'identités et détails temporaires | Générateur de nom temporaire et aléatoire",
    language: "Langue :",
    gender: "Genre :",
    nationality: "Nationalité :",
    count: "Combien ?",
    generate: "Générer",
    copy: "Copier tout",
    export: "Exporter JSON",
    name: "Nom ",
    email: "Adresse Email ",
    streetNumber: "Numéro de rue ",
    streetName: "Nom de rue ",
    city: "Ville ",
    state: "État ",
    country: "Pays ",
    postcode: "Code postal ",
    address: "Adresse ",
    birthday: "Anniversaire ",
    nationality_label: "Nationalité ",
    link1:"Générateur d'identité",
    link2:"Générateur de mots de passe",
    

  },
  en: {
    title_website: "Fake name Generator - Generate Random names ",
    title: "Fake Identity Generator | fake name Generator | Random Name Generator | Ramdom Identity Generator ",
    language: "Language:",
    gender: "Gender:",
    nationality: "Nationality:",
    count: "How many?",
    generate: "Generate",
    copy: "Copy All",
    export: "Export JSON",
    name: "Name",
    email: "Email Address",
    streetNumber: "Street number",
    streetName: "Street name",
    city: "City",
    state: "State",
    country: "Country",
    postcode: "Post code",
    address: "Address",
    birthday: "Birthday",
    nationality_label: "Nationality",
    link1:"Identity Generator",
    link2:"Password Generator",
  }
};

window.addEventListener('DOMContentLoaded', () => {
  const lang = navigator.language.startsWith('fr') ? 'fr' : 'en';

  const languageSelect = document.getElementById('language');
  if(languageSelect) languageSelect.value = lang;

  applyLanguage(lang);

  populateNationalities();

  generateIdentities(1);

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }
});

const languageSelect = document.getElementById('language');
if(languageSelect){
  languageSelect.addEventListener('change', (e) => {
    applyLanguage(e.target.value);
  });
}

function applyLanguage(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  translateIdentityCards(lang);
}

function populateNationalities() {
  const select = document.getElementById('nationality');
  if (!select) return;

  select.innerHTML = '';
  for (let code in nationalities) {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = nationalities[code];
    select.appendChild(option);
  }
}

function generateIdentities(count = null) {
  const gender = document.getElementById('gender')?.value || '';
  const nat = document.getElementById('nationality')?.value || '';
  const resultCount = count || parseInt(document.getElementById('count')?.value) || 1;
  const url = `https://randomuser.me/api/?results=${resultCount}&gender=${gender}&nat=${nat}`;

  showLoader(true);
  fetch(url)
    .then(res => res.json())
    .then(data => {
      displayIdentities(data.results);
      showLoader(false);
    })
    .catch(() => showLoader(false));
}

function displayIdentities(people) {
  const container = document.getElementById('output');
  if (!container) return;
  container.innerHTML = '';

  people.forEach(person => {
    const card = document.createElement('div');
    card.className = 'identity-card';
    card.innerHTML = `<div>
      <div class="image-container" style="margin-bottom:20px">
        <img src="${person.picture.large}" alt="Avatar" width="130" height="130" loading="lazy" />
      </div>
      <p><strong data-i18n="name"></strong>:${person.name.title} ${person.name.first} ${person.name.last}</p>
      <p><strong data-i18n="email"></strong>: ${person.email}</p>
      <p><strong>Phone:</strong> ${person.phone}</p>
      <p><strong data-i18n="streetNumber"></strong>: ${person.location.street.number}</p>
      <p><strong data-i18n="streetName"></strong>: ${person.location.street.name}</p>
      <p><strong data-i18n="city"></strong>: ${person.location.city}</p>
      <p><strong data-i18n="state"></strong>: ${person.location.state}</p>
      <p><strong data-i18n="country"></strong>: ${person.location.country}</p>
      <p><strong data-i18n="postcode"></strong>: ${person.location.postcode}</p>
      <p><strong data-i18n="address"></strong>: ${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.state}, ${person.location.country}, ${person.location.postcode}</p>
      <p><strong data-i18n="birthday"></strong>: ${new Date(person.dob.date).toLocaleDateString()}</p>
      <p><strong data-i18n="nationality_label"></strong>: ${nationalities[person.nat] || person.nat}</p> </div>
    `;
    container.appendChild(card);
  });

  const currentLang = document.getElementById('language')?.value || 'fr';
  applyLanguage(currentLang);
}

function translateIdentityCards(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

function copyToClipboard() {
  const text = document.getElementById('output')?.innerText || '';
  const btn_copy = document.querySelector('.btn-copy')
  if(!text) return alert('Rien à copier.');
  
  navigator.clipboard.writeText(text).then(() => {
    btn_copy.textContent = "✅ Copié";
      setTimeout(() => (btn_copy.textContent = "Copier tout"), 2000);
  });
}

function exportJSON() {
  const gender = document.getElementById('gender')?.value || '';
  const nat = document.getElementById('nationality')?.value || '';
  const count = parseInt(document.getElementById('count')?.value) || 1;
  const url = `https://randomuser.me/api/?results=${count}&gender=${gender}&nat=${nat}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const blob = new Blob([JSON.stringify(data.results, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'identities.json';
      link.click();
    });
}

const darkModeBtn = document.getElementById("toggleDarkMode");
if(darkModeBtn){
  darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
  });
}

const copyHistoryBtn = document.getElementById("copyHistory");
if (copyHistoryBtn) {
  copyHistoryBtn.addEventListener("click", () => {
    const history = JSON.parse(localStorage.getItem("passwordHistory")) || [];
    if (!history.length) {
      alert("Aucun historique disponible.");
      return;
    }
    navigator.clipboard.writeText(history.join('\n')).then(() => {
      copyHistoryBtn.textContent = "✅ Copié";
      setTimeout(() => (copyHistoryBtn.textContent = "📋 Copier l’historique"), 2000);
    });
  });
}

function showLoader(show) {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = show ? 'block' : 'none';
}
