// Year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Theme handling
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");

  if (!toggle) return;

  const stored = window.localStorage.getItem("bovinehero-theme");
  // Default = light
  const initial = stored === "dark" ? "dark" : "light";
  root.setAttribute("data-theme", initial);

  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    window.localStorage.setItem("bovinehero-theme", next);
  });
})();
