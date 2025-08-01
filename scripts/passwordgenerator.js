const passwordField = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");
const excludeAmbiguous = document.getElementById("excludeAmbiguous");
const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copy");
const toggleVisibilityBtn = document.getElementById("toggleVisibility");
const strengthText = document.getElementById("strengthText");
const downloadBtn = document.getElementById("download");
const showQRBtn = document.getElementById("showQR");
const showHistoryBtn = document.getElementById("showHistory");
const qrCodeDiv = document.getElementById("qrcode");
const historyBox = document.getElementById("historyBox");
const historyList = document.getElementById("historyList");
const copyHistoryBtn = document.getElementById("copyHistory");
const languageSelect = document.getElementById("languageSelect");
const darkModeBtn = document.getElementById("toggleDarkMode");

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-={}[]|:;<>?,./";
const AMBIGUOUS = "O0Il1";

const translations = {
  fr: {
    language: "Langue :",
    dark_mode: "🌓 Mode sombre",
    link1:"Générateur d'identité",
    link2:"Générateur de mots de passe",
    copy_history: "Copier l’historique",
    title: "🔐 Générateur de mot de passe sécurisé gratuitement",
    password_placeholder: "cliquez sur générer et votre mot de passe apparaitra ici",
    copy: "Copier",
    length: "Longueur :",
    uppercase: "Inclure des majuscules",
    lowercase: "Inclure des minuscules",
    numbers: "Inclure des chiffres",
    symbols: "Inclure des symboles",
    exclude_ambiguous: "Exclure les caractères ambigus",
    generate: "Générer",
    strength: "Force :",
    download: "Télécharger",
    show_qr: "QR Code",
    show_history: "Historique",
    alert_no_charset: "Choisissez au moins un type de caractère !",
    alert_no_history: "Aucun historique disponible.",
    copied: "✅",
  },
  en: {
    language: "Language:",
    link1:"Identity Generator",
    link2:"Password Generator",
    dark_mode: "🌓 Dark mode",
    copy_history: ` Copy history`,
    title: "🔐Strong, secure and free password generator",
    password_placeholder: "click on generate and you will see your password here",
    copy: "Copy",
    length: "Length:",
    uppercase: "Include uppercase letters",
    lowercase: "Include lowercase letters",
    numbers: "Include numbers",
    symbols: "Include symbols",
    exclude_ambiguous: "Exclude ambiguous characters",
    generate: "Generate",
    strength: "Strength:",
    download: "Download",
    show_qr: " QR Code",
    show_history: "History",
    alert_no_charset: "Please select at least one character type!",
    alert_no_history: "No history available.",
    copied: "✅",
  }
};

function applyLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const lang = languageSelect.value || "fr";
  applyLanguage(lang);
  restoreDarkMode();
  updateLengthValue();
});

languageSelect.addEventListener("change", (e) => {
  applyLanguage(e.target.value);
});

lengthSlider.addEventListener("input", updateLengthValue);
function updateLengthValue() {
  lengthValue.textContent = lengthSlider.value;
}

generateBtn.addEventListener("click", () => {
  const lang = languageSelect.value;
  const length = parseInt(lengthSlider.value);
  let charset = "";

  if (uppercase.checked) charset += UPPERCASE;
  if (lowercase.checked) charset += LOWERCASE;
  if (numbers.checked) charset += NUMBERS;
  if (symbols.checked) charset += SYMBOLS;

  if (excludeAmbiguous.checked) {
    charset = charset.split("").filter(c => !AMBIGUOUS.includes(c)).join("");
  }

  if (!charset.length) {
    alert(translations[lang].alert_no_charset);
    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  passwordField.value = password;
  updateStrength(password);

});

function updateStrength(password) {
  let score = 0;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;

  const lang = languageSelect.value;
  const labelsFr = ["Très faible", "Faible", "Moyenne", "Forte", "Très forte"];
  const labelsEn = ["Very weak", "Weak", "Medium", "Strong", "Very strong"];
  const labels = lang === "fr" ? labelsFr : labelsEn;

  strengthText.textContent = labels[score] || "-";
}

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(passwordField.value);
  copyBtn.textContent = "✅";
  setTimeout(() => (copyBtn.innerHTML =`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white"
            class="bi bi-clipboard-fill" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1A2.5 2.5 0 0 0 6.5 5h3A2.5 2.5 0 0 0 12 2.5v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2" />
          </svg>`), 2000);
});

toggleVisibilityBtn.addEventListener("click", () => {
  if (passwordField.type === "text") {
    passwordField.type = "password";
    toggleVisibilityBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
</svg>`;
  } else {
    passwordField.type = "text";
    toggleVisibilityBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
</svg>`
  }
});

downloadBtn.addEventListener("click", () => {
  const blob = new Blob([passwordField.value], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "mot_de_passe.txt";
  link.click();
});

showQRBtn.addEventListener("click", () => {
  if (passwordField.value) {
    qrCodeDiv.innerHTML = ""
  const qrResult =  new QRCode(qrCodeDiv, {
      text: passwordField.value,
      width: 150,
      height: 150
    });
  }
});

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);
});

function restoreDarkMode() {
  const isDark = localStorage.getItem("darkMode") === "true";
  if (isDark) document.body.classList.add("dark");
}
