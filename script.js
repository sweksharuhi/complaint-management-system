document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('complaintForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        subject: document.getElementById('subject').value,
        category: document.getElementById('category').value,
        department: document.getElementById('department').value,
        priority: document.getElementById('priority').value,
        description: document.getElementById('description').value
      };
      try {
        const res = await fetch('http://localhost:3000/api/complaints', {
          method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
        });
        const result = await res.json();
        document.getElementById('message').textContent =
          res.ok ? `Complaint submitted successfully. ID: ${result.complaintId}` :
          (result.message || 'Unable to submit complaint.');
      } catch {
        document.getElementById('message').textContent =
          'Demo mode: complaint form is working, but the backend is not running.';
      }
    });
  }

  const search = document.getElementById('search');
  const status = document.getElementById('statusFilter');
  const priority = document.getElementById('priorityFilter');
  const table = document.getElementById('complaintTable');
  function filterRows() {
    if (!table) return;
    const q = (search.value || '').toLowerCase();
    [...table.tBodies[0].rows].forEach(row => {
      const text = row.innerText.toLowerCase();
      const statusOk = !status.value || text.includes(status.value.toLowerCase());
      const priorityOk = !priority.value || text.includes(priority.value.toLowerCase());
      row.style.display = text.includes(q) && statusOk && priorityOk ? '' : 'none';
    });
  }
  if (search) [search,status,priority].forEach(x => x.addEventListener('input', filterRows));
});
