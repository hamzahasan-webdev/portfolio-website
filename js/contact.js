/* ──────────────────────────────────────────────────────────────────
   Contact page — form UX
   ────────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const resetBtn = document.getElementById('form-reset');
  const submitBtn = document.getElementById('form-submit');
  const submitText = document.getElementById('submit-text');
  const submitSpinner = document.getElementById('submit-spinner');

  if (!form) return;

  let autoHideTimer = null;

  function resetForm() {
    if (autoHideTimer) {
      clearTimeout(autoHideTimer);
      autoHideTimer = null;
    }
    if (success) success.classList.remove('show');
    submitBtn.disabled = false;
    if (submitText) submitText.style.display = 'inline';
    if (submitSpinner) submitSpinner.style.display = 'none';
    form.reset();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Block empty/invalid submissions — shows the browser's built-in
    // "Please fill out this field" prompt right at the empty field.
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Show spinner
    submitBtn.disabled = true;
    if (submitText) submitText.style.display = 'none';
    if (submitSpinner) submitSpinner.style.display = 'inline-block';

    // Simulate submission
    setTimeout(() => {
      if (success) success.classList.add('show');

      // Auto-hide the success message and reset the form after a few
      // seconds even if the user never clicks "Send another message".
      autoHideTimer = setTimeout(resetForm, 4000);
    }, 1500);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', resetForm);
  }
});
