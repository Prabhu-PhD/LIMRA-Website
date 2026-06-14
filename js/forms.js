/* ============================================================
   forms.js — host-agnostic form delivery via Web3Forms
   Works on Netlify or ANY host (the form just POSTs to an API).

   >>> ONE-TIME SETUP <<<
   1. Go to https://web3forms.com  (free), enter the email that should
      receive enquiries, and copy your "Access Key".
   2. Paste it below in place of YOUR_WEB3FORMS_ACCESS_KEY.
   3. Commit / redeploy. That's it — both the home and contact forms use it.

   Until a real key is set, forms will show an error instead of sending.
   ============================================================ */
(function () {
  var ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";

  function handle(form) {
    var msg = form.querySelector(".enquiry-msg, .form-msg, [data-form-msg]");
    var btn = form.querySelector('[type="submit"]');
    var redirect = form.getAttribute("data-redirect") || "/thank-you.html";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!ACCESS_KEY || ACCESS_KEY.indexOf("YOUR_") === 0) {
        showMsg("Form not configured yet — please call us at +91-94443 75000.", true);
        return;
      }

      var data = new FormData(form);
      data.append("access_key", ACCESS_KEY);
      if (!data.get("subject")) data.append("subject", "New enquiry from the LIMRA website");
      if (!data.get("from_name")) data.append("from_name", "LIMRA Website");

      var label = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      showMsg("", false);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.success) {
            window.location.href = redirect;
          } else {
            showMsg("Sorry, something went wrong. Please try again or call us at +91-94443 75000.", true);
            restore();
          }
        })
        .catch(function () {
          showMsg("Network error. Please try again or call us at +91-94443 75000.", true);
          restore();
        });

      function restore() { if (btn) { btn.disabled = false; btn.textContent = label; } }
    });

    function showMsg(text, isError) {
      if (!msg) return;
      msg.textContent = text;
      msg.classList.toggle("error", !!isError);
      msg.classList.toggle("show", !!text);
      msg.style.display = text ? "" : "none";
    }
  }

  document.querySelectorAll("form.js-web3form").forEach(handle);
})();
