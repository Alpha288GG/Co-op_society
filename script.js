// For toggling between user and admin views
function setActiveView(view) {
  const userSection = document.getElementById("userSection");
  const adminSection = document.getElementById("adminSection");
  const userBtn = document.getElementById("userViewBtn");
  const adminBtn = document.getElementById("adminViewBtn");
  if (view === "user") {
    userSection.style.display = "block";
    adminSection.style.display = "none";
    userBtn.classList.add("active");
    adminBtn.classList.remove("active");
  } else {
    userSection.style.display = "none";
    adminSection.style.display = "block";
    userBtn.classList.remove("active");
    adminBtn.classList.add("active");
    renderPaymentsTable();
  }
}

// For payment submission
if (document.getElementById("paymentForm")) {
  document.getElementById("paymentForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const flat = document.getElementById("flat").value;
    const amount = document.getElementById("amount").value;
    const reason = document.getElementById("reason").value;
    const date = new Date().toLocaleString();

    const paymentData = { name, flat, amount, reason, date };
    let records = JSON.parse(localStorage.getItem("payments")) || [];
    records.push(paymentData);
    localStorage.setItem("payments", JSON.stringify(records));

    alert("Payment Recorded Successfully!");
    document.getElementById("paymentForm").reset();
    renderPaymentsTable(); // Update admin table if needed
  });
}

// Render payments table
function renderPaymentsTable() {
  const tbody = document.querySelector("#paymentsTable tbody");
  if (!tbody) return;
  let records = JSON.parse(localStorage.getItem("payments")) || [];
  tbody.innerHTML = "";
  records.forEach((item, idx) => {
    const status = item.status === 'paid' ? '✅' : (item.status === 'due' ? '❌' : '');
    const proof = item.proof
      ? `<div style='display:flex;align-items:center;gap:6px;'>
            <a href="#" class="proof-link" data-img="${item.proof}" title="View Image">View</a>
            <img src="${item.proof}" alt="Proof" class="proof-thumb" style="height:32px;width:auto;border-radius:4px;border:1px solid #ccc;" />
            <button class="delete-proof-btn" data-idx="${idx}" title="Delete Proof">🗑️</button>
         </div>`
      : `<input type='file' accept='image/*' class='proof-upload' data-idx='${idx}' />`;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Name">${item.name}</td>
      <td data-label="Flat">${item.flat}</td>
      <td data-label="Amount">₹${item.amount}</td>
      <td data-label="Reason">${item.reason}</td>
      <td data-label="Date">${item.date}</td>
      <td data-label="Status">
        <button class="status-btn paid-btn" data-idx="${idx}" data-status="paid" title="Mark as Paid">✔️</button>
        <button class="status-btn due-btn" data-idx="${idx}" data-status="due" title="Mark as Due">✖️</button>
        <span class="status-indicator">${status}</span>
      </td>
      <td data-label="Proof">${proof}</td>
      <td data-label="Action"><button class="remove-btn" data-idx="${idx}">Remove</button></td>
    `;
    tbody.appendChild(row);
  });
  // Remove buttons
  tbody.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      let records = JSON.parse(localStorage.getItem("payments")) || [];
      records.splice(idx, 1);
      localStorage.setItem("payments", JSON.stringify(records));
      renderPaymentsTable();
    });
  });
  // Status buttons
  tbody.querySelectorAll('.status-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      const status = this.getAttribute('data-status');
      let records = JSON.parse(localStorage.getItem("payments")) || [];
      records[idx].status = status;
      localStorage.setItem("payments", JSON.stringify(records));
      renderPaymentsTable();
    });
  });
  // Proof upload
  tbody.querySelectorAll('.proof-upload').forEach(input => {
    input.addEventListener('change', function(e) {
      const idx = parseInt(this.getAttribute('data-idx'));
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          let records = JSON.parse(localStorage.getItem("payments")) || [];
          records[idx].proof = evt.target.result;
          localStorage.setItem("payments", JSON.stringify(records));
          renderPaymentsTable();
        };
        reader.readAsDataURL(file);
      }
    });
  });
  // Delete proof
  tbody.querySelectorAll('.delete-proof-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      let records = JSON.parse(localStorage.getItem("payments")) || [];
      records[idx].proof = undefined;
      localStorage.setItem("payments", JSON.stringify(records));
      renderPaymentsTable();
    });
  });
  // Proof view (modal)
  tbody.querySelectorAll('.proof-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const imgSrc = this.getAttribute('data-img');
      showImageModal(imgSrc);
    });
  });
}

// Voice input for payment form
function fillFormFromSpeech(text) {
  // Lowercase and normalize
  const norm = text.toLowerCase().replace(/\s+/g, ' ');
  // Extract fields in any order
        const imgSrc = this.getAttribute('data-img');
        showImageModal(imgSrc);
      }
    });
  });
}

// Voice input for payment form
function fillFormFromSpeech(text) {
  // Lowercase and normalize
  const norm = text.toLowerCase().replace(/\s+/g, ' ');
  // Extract fields in any order
  let flat = '', name = '', amount = '', reason = '';
  // Flat
  const flatMatch = norm.match(/flat(?:\s*number|\s*no\.?|)\s*(\w+)/i);
  if (flatMatch) flat = flatMatch[1].trim();
  // Name
  const nameMatch = norm.match(/name\s+([a-zA-Z ]+?)(?= amount| reason| flat|$)/i);
  if (nameMatch) name = nameMatch[1].trim();
  // Amount
  const amountMatch = norm.match(/amount\s*(\d+)/i);
  if (amountMatch) amount = amountMatch[1].trim();
  // Reason
  const reasonMatch = norm.match(/reason\s+([a-zA-Z ]+)/i);
  if (reasonMatch) reason = reasonMatch[1].trim();
  // Fill fields if found
  if (flat) document.getElementById("flat").value = flat;
  if (name) document.getElementById("name").value = name;
  if (amount) document.getElementById("amount").value = amount;
  if (reason) document.getElementById("reason").value = reason;
  // Show summary
  alert(`Recognized:\nFlat: ${flat || '-'}\nName: ${name || '-'}\nAmount: ${amount || '-'}\nReason: ${reason || '-'}`);
}

function startVoiceInput() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Sorry, your browser does not support speech recognition.');
    return;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    fillFormFromSpeech(transcript);
    // Give feedback to user
    alert('Voice recognized: ' + transcript);
  };
  recognition.onerror = function(event) {
    if (event.error !== 'aborted') {
      alert('Voice input error: ' + event.error);
    }
  };
  recognition.onend = function() {
    // Optionally, you can re-enable the button or give feedback here
  };
  recognition.start();
}

// Modal for viewing proof image
function showImageModal(imgSrc) {
  let modal = document.getElementById('imgModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'imgModal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.innerHTML = `<div style='position:relative;background:#fff;padding:16px 16px 8px 16px;border-radius:8px;box-shadow:0 2px 16px #0005;'>
      <img src="${imgSrc}" style="max-width:80vw;max-height:70vh;display:block;margin:auto;border-radius:6px;" />
      <button id="closeImgModal" style="position:absolute;top:6px;right:10px;font-size:1.5em;background:none;border:none;color:#333;cursor:pointer;">&times;</button>
    </div>`;
    document.body.appendChild(modal);
    document.getElementById('closeImgModal').onclick = function() {
      modal.remove();
    };
    modal.onclick = function(e) {
      if (e.target === modal) modal.remove();
    };
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Toggle buttons
  const userBtn = document.getElementById("userViewBtn");
  const adminBtn = document.getElementById("adminViewBtn");
  if (userBtn && adminBtn) {
    userBtn.addEventListener("click", function () { setActiveView("user"); });
    adminBtn.addEventListener("click", function () { setActiveView("admin"); });
  }
  // Initial render
  setActiveView("user");
  renderPaymentsTable();

  // Add voice button to form
  const paymentForm = document.getElementById("paymentForm");
  if (paymentForm && !document.getElementById("voiceBtn")) {
    const voiceBtn = document.createElement("button");
    voiceBtn.type = "button";
    voiceBtn.id = "voiceBtn";
    voiceBtn.innerHTML = "🎤 Voice Input";
    voiceBtn.className = "nav-btn";
    voiceBtn.style.marginTop = "8px";
    voiceBtn.onclick = startVoiceInput;
    paymentForm.appendChild(voiceBtn);
  }
});
