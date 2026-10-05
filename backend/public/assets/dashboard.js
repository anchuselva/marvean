// ============================================================================
// MARVEAN Intelligence Platform - Client Interactive Engine
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Flash auto-dismiss after 6 seconds
  const flashAlerts = document.querySelectorAll('.alert');
  flashAlerts.forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.4s ease';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 400);
    }, 6000);
  });

  // Client-side quick filter on data tables
  const searchInput = document.querySelector('[data-table-search]');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const rows = document.querySelectorAll('[data-searchable-table] tbody tr');
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
      });
    });
  }

  // Delete confirmations
  document.querySelectorAll('form[data-confirm]').forEach(form => {
    form.addEventListener('submit', (e) => {
      const msg = form.getAttribute('data-confirm') || 'Are you sure you want to permanently delete this intelligence record?';
      if (!confirm(msg)) {
        e.preventDefault();
      }
    });
  });
});
