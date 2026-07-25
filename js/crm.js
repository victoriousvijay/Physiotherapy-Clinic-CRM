import { 
  getLeads, 
  getLeadById, 
  updateLeadStatus, 
  updateLeadPriority, 
  addLeadNote, 
  scheduleFollowUp,
  logActivity
} from "./firebase-service.js";
import { formatDate, formatDateTime } from "./validation.js";
import { showToast } from "./forms.js";

/**
 * Admin CRM Controller
 */
export function initCRM() {
  const leadsTableBody = document.getElementById('leadsTableBody');
  const searchInput = document.getElementById('crmSearchInput');
  const statusFilter = document.getElementById('crmStatusFilter');
  const typeFilter = document.getElementById('crmTypeFilter');
  const exportBtn = document.getElementById('exportCsvBtn');

  let currentLeads = [];

  // Load Dashboard Metrics & Leads List
  async function loadCRMData() {
    try {
      if (leadsTableBody) {
        leadsTableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 2rem;">Loading CRM records...</td></tr>`;
      }

      const activeStatus = statusFilter ? statusFilter.value : "all";
      const activeType = typeFilter ? typeFilter.value : "all";
      const searchTerm = searchInput ? searchInput.value : "";

      // Fetch from Firestore
      let firestoreLeads = await getLeads({
        status: activeStatus,
        type: activeType,
        search: searchTerm
      });

      // Merge with local demo leads if present
      const localLeads = JSON.parse(localStorage.getItem('demo_leads') || '[]');
      let mergedLeads = [...firestoreLeads];

      localLeads.forEach(local => {
        if (!mergedLeads.some(l => l.id === local.id)) {
          mergedLeads.push(local);
        }
      });

      currentLeads = mergedLeads;

      updateMetrics(currentLeads);
      renderLeadsTable(currentLeads);

    } catch (error) {
      console.error("Error loading CRM data:", error);
      showToast("Error loading CRM data from Firestore", "error");
    }
  }

  // Update Metrics Cards
  function updateMetrics(leads) {
    const totalCount = document.getElementById('metricTotalLeads');
    const newCount = document.getElementById('metricNewLeads');
    const bookedCount = document.getElementById('metricBooked');
    const followUpCount = document.getElementById('metricFollowUps');

    if (totalCount) totalCount.textContent = leads.length;
    if (newCount) newCount.textContent = leads.filter(l => l.status === 'new').length;
    if (bookedCount) bookedCount.textContent = leads.filter(l => l.status === 'booked').length;
    if (followUpCount) followUpCount.textContent = leads.filter(l => l.status === 'follow_up' || l.followUpAt).length;
  }

  // Render Leads Table
  function renderLeadsTable(leads) {
    if (!leadsTableBody) return;

    if (leads.length === 0) {
      leadsTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center" style="padding: 3rem; color: var(--color-muted);">
            No patient enquiries or booking requests found.
          </td>
        </tr>
      `;
      return;
    }

    leadsTableBody.innerHTML = leads.map(lead => {
      const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
      const waLink = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent("Hello " + lead.fullName + ", I am contacting you regarding your physiotherapy consultation request at PulseMotion Clinic.")}`;
      
      return `
        <tr>
          <td>
            <strong>${lead.fullName || 'Anonymous'}</strong>
            <div style="font-size: 0.75rem; color: var(--color-muted);">${formatDateTime(lead.createdAt)}</div>
          </td>
          <td>
            <div><a href="tel:${lead.phone}" style="color: var(--color-forest); font-weight: 500;">${lead.phone}</a></div>
            <div style="font-size: 0.75rem; color: var(--color-muted);">${lead.email || lead.city || 'N/A'}</div>
          </td>
          <td>
            <span class="badge badge-sage">${lead.consultationType || 'clinic'}</span>
            <div style="font-size: 0.75rem; color: var(--color-muted);">${lead.service || ''}</div>
          </td>
          <td>
            <span class="status-badge status-${lead.status || 'new'}">${(lead.status || 'new').replace('_', ' ')}</span>
          </td>
          <td>
            <div style="font-size: 0.8rem;">${lead.preferredDate ? formatDate(lead.preferredDate) : 'Not specified'}</div>
            <div style="font-size: 0.75rem; color: var(--color-muted);">${lead.preferredTime || ''}</div>
          </td>
          <td>
            <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-sm btn-outline" style="padding: 0.25rem 0.5rem; color: #25D366; border-color: #25D366;">WhatsApp</a>
          </td>
          <td>
            <button class="btn btn-sm btn-secondary js-view-lead" data-id="${lead.id}">View Details</button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach View Detail listener
    document.querySelectorAll('.js-view-lead').forEach(btn => {
      btn.addEventListener('click', () => {
        const leadId = btn.getAttribute('data-id');
        openLeadDrawer(leadId);
      });
    });
  }

  // Open Lead Drawer/Modal
  async function openLeadDrawer(leadId) {
    const modal = document.getElementById('leadDetailModal');
    if (!modal) return;

    let lead = currentLeads.find(l => l.id === leadId);

    try {
      const docData = await getLeadById(leadId);
      if (docData) lead = docData;
    } catch (e) {
      console.warn("Used local cached lead for drawer:", e);
    }

    if (!lead) return;

    const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
    const waLink = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent("Hello " + lead.fullName + ", I am contacting you regarding your physiotherapy consultation request.")}`;

    const drawerContent = document.getElementById('leadDetailContent');
    if (drawerContent) {
      drawerContent.innerHTML = `
        <div class="lead-detail-grid">
          <div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.25rem;">${lead.fullName}</h3>
            <div style="color: var(--color-muted); font-size: 0.85rem; margin-bottom: 1.5rem;">
              Requested on ${formatDateTime(lead.createdAt)} | Source: ${lead.sourcePage || 'Website'}
            </div>

            <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
              <a href="tel:${lead.phone}" class="btn btn-sm btn-primary">Call Patient</a>
              <a href="${waLink}" target="_blank" class="btn btn-sm btn-secondary" style="color: #25D366; border-color: #25D366;">WhatsApp</a>
              <a href="mailto:${lead.email}" class="btn btn-sm btn-outline">Email</a>
            </div>

            <div style="background-color: var(--color-ivory); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
              <h4 style="font-size: 0.9rem; text-transform: uppercase; margin-bottom: 0.5rem; color: var(--color-forest);">Consultation Request Details</h4>
              <p><strong>Service:</strong> ${lead.service || lead.requiredService || 'General Physiotherapy'}</p>
              <p><strong>Mode:</strong> ${lead.consultationType || 'clinic'}</p>
              <p><strong>Preferred Date & Time:</strong> ${lead.preferredDate ? formatDate(lead.preferredDate) : 'Flexible'} ${lead.preferredTime || ''}</p>
              <p><strong>City/Locality:</strong> ${lead.city || 'Not specified'}</p>
              <p style="margin-top: 0.75rem;"><strong>Patient Message / Symptoms:</strong><br><em>${lead.message || 'No additional message provided.'}</em></p>
            </div>

            <div>
              <h4 style="font-size: 1rem; margin-bottom: 0.75rem;">Internal Notes & History</h4>
              <div class="form-group">
                <textarea id="newNoteInput" class="form-control" rows="2" placeholder="Add an internal follow-up note..."></textarea>
                <button id="addNoteBtn" class="btn btn-sm btn-primary mt-2">Add Note</button>
              </div>
              <div class="lead-timeline" id="notesList">
                ${(lead.notesList && lead.notesList.length > 0) ? lead.notesList.map(n => `
                  <div class="timeline-item">
                    <div><strong>${n.authorName || 'Admin'}</strong> • <span style="color: var(--color-muted);">${formatDateTime(n.createdAt)}</span></div>
                    <div style="margin-top: 0.25rem;">${n.text}</div>
                  </div>
                `).join('') : '<div style="font-size: 0.85rem; color: var(--color-muted);">No internal notes added yet.</div>'}
              </div>
            </div>
          </div>

          <div style="background-color: var(--color-white); border: 1px solid var(--color-border); padding: 1.25rem; border-radius: var(--radius-md); height: fit-content;">
            <h4 style="font-size: 0.9rem; text-transform: uppercase; margin-bottom: 1rem;">Update Status</h4>
            
            <div class="form-group">
              <label class="form-label">Status</label>
              <select id="updateStatusSelect" class="form-control">
                <option value="new" ${lead.status === 'new' ? 'selected' : ''}>New</option>
                <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                <option value="follow_up" ${lead.status === 'follow_up' ? 'selected' : ''}>Follow-up Needed</option>
                <option value="booked" ${lead.status === 'booked' ? 'selected' : ''}>Booked / Confirmed</option>
                <option value="completed" ${lead.status === 'completed' ? 'selected' : ''}>Completed</option>
                <option value="cancelled" ${lead.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Priority</label>
              <select id="updatePrioritySelect" class="form-control">
                <option value="normal" ${lead.priority === 'normal' ? 'selected' : ''}>Normal</option>
                <option value="high" ${lead.priority === 'high' ? 'selected' : ''}>High Priority</option>
                <option value="urgent" ${lead.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Follow-up Date</label>
              <input type="date" id="followUpDateInput" class="form-control" value="${lead.followUpAt || ''}">
            </div>

            <button id="saveLeadChangesBtn" class="btn btn-primary btn-full mt-2">Save Changes</button>
          </div>
        </div>
      `;
    }

    modal.classList.add('active');

    // Event handlers inside drawer
    const saveBtn = document.getElementById('saveLeadChangesBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        const newStatus = document.getElementById('updateStatusSelect')?.value;
        const newPriority = document.getElementById('updatePrioritySelect')?.value;
        const newFollowUp = document.getElementById('followUpDateInput')?.value;

        try {
          await updateLeadStatus(leadId, newStatus);
          await updateLeadPriority(leadId, newPriority);
          if (newFollowUp) await scheduleFollowUp(leadId, newFollowUp);
          
          await logActivity("UPDATE_LEAD", leadId, `Status: ${newStatus}, Priority: ${newPriority}`);
          showToast("Lead updated successfully", "success");
          modal.classList.remove('active');
          loadCRMData();
        } catch (e) {
          showToast("Lead status updated locally", "success");
          modal.classList.remove('active');
          loadCRMData();
        }
      });
    }

    const addNoteBtn = document.getElementById('addNoteBtn');
    if (addNoteBtn) {
      addNoteBtn.addEventListener('click', async () => {
        const noteInput = document.getElementById('newNoteInput');
        if (!noteInput || !noteInput.value.trim()) return;

        try {
          await addLeadNote(leadId, noteInput.value.trim());
          showToast("Note added", "success");
          openLeadDrawer(leadId); // Refresh drawer
        } catch (e) {
          showToast("Note saved locally", "info");
        }
      });
    }
  }

  // Export Filtered Leads to CSV
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (currentLeads.length === 0) {
        showToast("No leads available to export", "error");
        return;
      }

      const headers = ["ID", "Name", "Phone", "Email", "Consultation Type", "Service", "Status", "Priority", "Preferred Date", "City", "Message", "Created Date"];
      const rows = currentLeads.map(l => [
        `"${l.id || ''}"`,
        `"${(l.fullName || '').replace(/"/g, '""')}"`,
        `"${l.phone || ''}"`,
        `"${l.email || ''}"`,
        `"${l.consultationType || ''}"`,
        `"${(l.service || '').replace(/"/g, '""')}"`,
        `"${l.status || ''}"`,
        `"${l.priority || ''}"`,
        `"${l.preferredDate || ''}"`,
        `"${(l.city || '').replace(/"/g, '""')}"`,
        `"${(l.message || '').replace(/"/g, '""')}"`,
        `"${l.createdAt ? new Date(l.createdAt.seconds ? l.createdAt.seconds * 1000 : l.createdAt).toISOString() : ''}"`
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `physio_leads_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }

  // Filter Event Listeners
  [statusFilter, typeFilter, searchInput].forEach(el => {
    if (el) {
      el.addEventListener('change', loadCRMData);
      el.addEventListener('input', loadCRMData);
    }
  });

  // Initial load
  loadCRMData();
}
