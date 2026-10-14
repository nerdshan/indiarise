const $ = (id) => document.getElementById(id);
const LS_SEEKERS = "abdms_seekers";
const LS_INV = "abdms_investor";

function show(id) {
  document.querySelectorAll(".view").forEach((v) => v.classList.add("hidden"));
  $(id).classList.remove("hidden");
}

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.style.display = "block";
  setTimeout(() => { t.style.display = "none"; }, 2400);
}

function loadSeekers() {
  const raw = localStorage.getItem(LS_SEEKERS);
  if (!raw) {
    localStorage.setItem(LS_SEEKERS, JSON.stringify(SEED_SEEKERS));
    return [...SEED_SEEKERS];
  }
  return JSON.parse(raw);
}

function saveSeeker(s) {
  const all = loadSeekers();
  all.unshift(s);
  localStorage.setItem(LS_SEEKERS, JSON.stringify(all));
}

const state = {
  investor: null,
  step: "state",
  selectedState: null,
  product: null,
  district: null,
  employerDraft: null,
  workType: null
};

function resetInvestorFlow() {
  state.step = "state";
  state.selectedState = null;
  state.product = null;
  state.district = null;
}

document.querySelectorAll("[data-home]").forEach((b) => {
  b.addEventListener("click", () => {
    localStorage.removeItem(LS_INV);
    state.investor = null;
    resetInvestorFlow();
    show("view-landing");
  });
});

$("go-investor").addEventListener("click", () => show("view-investor-login"));
$("go-employer").addEventListener("click", () => {
  const sel = $("emp-district");
  sel.innerHTML = DISTRICTS.map((d) => `<option value="${d.id}">${d.name}</option>`).join("");
  show("view-employer-login");
});

$("form-investor").addEventListener("submit", (e) => {
  e.preventDefault();
  state.investor = {
    name: $("inv-name").value.trim(),
    org: $("inv-org").value.trim(),
    email: $("inv-email").value.trim()
  };
  localStorage.setItem(LS_INV, JSON.stringify(state.investor));
  $("inv-hello").textContent = `${state.investor.name} · ${state.investor.org}`;
  resetInvestorFlow();
  renderInvestor();
  show("view-investor");
});

$("form-employer").addEventListener("submit", (e) => {
  e.preventDefault();
  state.employerDraft = {
    name: $("emp-name").value.trim(),
    age: Number($("emp-age").value),
    phone: $("emp-phone").value.trim(),
    email: $("emp-email").value.trim(),
    districtId: $("emp-district").value,
    education: $("emp-edu").value.trim(),
    experience: $("emp-exp").value.trim()
  };
  document.querySelectorAll(".type-card").forEach((c) => c.classList.remove("active"));
  $("job-pick").classList.add("hidden");
  show("view-work-type");
});

document.querySelectorAll(".type-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".type-card").forEach((c) => c.classList.remove("active"));
    card.classList.add("active");
    state.workType = card.dataset.type;
    const jobs = JOBS[state.workType];
    $("emp-job").innerHTML = jobs.map((j) => `<option>${j}</option>`).join("");
    $("job-pick").classList.remove("hidden");
  });
});

$("emp-submit").addEventListener("click", () => {
  const d = DISTRICTS.find((x) => x.id === state.employerDraft.districtId);
  const rec = {
    ...state.employerDraft,
    workType: state.workType,
    job: $("emp-job").value
  };
  saveSeeker(rec);
  $("done-msg").textContent = `${rec.name} listed for ${rec.job} (${rec.workType}) in ${d.name}. Investors opening Hire workforce in this district will see your contact.`;
  show("view-done");
});

function renderInvestor() {
  const body = $("inv-body");
  const crumbs = $("inv-crumbs");

  if (state.step === "state") {
    crumbs.textContent = "Select state";
    body.innerHTML = `
      <div class="field-block">
        <h3>Select state</h3>
        <label>All Indian states & UTs</label>
        <select id="state-select">
          <option value="">Choose a state</option>
          ${INDIAN_STATES.map((s) => {
            const live = s === LIVE_STATE;
            return `<option value="${s}" ${live ? "" : "disabled"}>${s}${live ? " (live)" : " — coming soon"}</option>`;
          }).join("")}
        </select>
        <p class="note">Every state is listed. Only Bihar can be selected in this demo.</p>
        <p class="warn hidden" id="state-warn">This state is not live yet. Please choose Bihar.</p>
      </div>
    `;
    $("state-select").addEventListener("change", (e) => {
      if (e.target.value !== LIVE_STATE) {
        $("state-warn").classList.remove("hidden");
        return;
      }
      state.selectedState = LIVE_STATE;
      state.step = "product";
      renderInvestor();
    });
    return;
  }

  if (state.step === "product") {
    crumbs.textContent = "Bihar → Select product";
    body.innerHTML = `
      <div class="field-block">
        <h3>Select product</h3>
        <p class="sub" style="margin-bottom:12px">Investment-grade commodities mapped to Bihar districts.</p>
        <select id="product-select">
          <option value="">Choose a product</option>
          ${PRODUCTS.map((p) => `<option>${p}</option>`).join("")}
        </select>
        <button class="btn secondary" id="back-state" type="button">Back to states</button>
      </div>
    `;
    $("product-select").addEventListener("change", (e) => {
      if (!e.target.value) return;
      state.product = e.target.value;
      state.step = "districts";
      renderInvestor();
    });
    $("back-state").addEventListener("click", () => {
      state.step = "state";
      state.selectedState = null;
      renderInvestor();
    });
    return;
  }

  if (state.step === "districts") {
    const list = DISTRICTS.filter((d) => districtHasProduct(d, state.product));
    crumbs.textContent = `Bihar → ${state.product} → districts`;
    body.innerHTML = `
      <div class="field-block">
        <h3>Districts with ${state.product}</h3>
        <p class="sub">${list.length ? `${list.length} district(s) with investment-grade availability.` : "No investment-grade mapping for this product."}</p>
        <div class="grid-cards">
          ${list.map((d) => `
            <button class="tile" data-dist="${d.id}">
              <strong>${d.name}</strong>
              <small>${d.notes || d.products.join(", ")}</small>
            </button>
          `).join("")}
        </div>
        <button class="btn secondary" id="back-prod" type="button">Back to products</button>
      </div>
    `;
    body.querySelectorAll("[data-dist]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.district = DISTRICTS.find((d) => d.id === btn.dataset.dist);
        state.step = "dashboard";
        renderInvestor();
      });
    });
    $("back-prod").addEventListener("click", () => {
      state.step = "product";
      state.product = null;
      renderInvestor();
    });
    return;
  }

  if (state.step === "hire") {
    const seekers = loadSeekers().filter((s) => s.districtId === state.district.id);
    crumbs.textContent = `Bihar → ${state.product} → ${state.district.name} → hire`;
    body.innerHTML = `
      <div class="dash-head">
        <div>
          <h2>Workforce in ${state.district.name}</h2>
          <p class="sub">${seekers.length} job-seeker(s) available. Contact directly to hire.</p>
        </div>
        <button class="ghost" id="back-dash">Back to district</button>
      </div>
      ${seekers.length ? seekers.map((s) => `
        <article class="seeker">
          <div>
            <strong>${s.name}</strong>
            <div style="margin:6px 0">
              <span class="badge">${s.workType}</span>
              <span class="badge">${s.job}</span>
            </div>
            <small>${s.education} · ${s.experience} · age ${s.age}</small>
          </div>
          <div>
            <div><a href="tel:${s.phone}">${s.phone}</a></div>
            <div><a href="mailto:${s.email}">${s.email}</a></div>
          </div>
        </article>
      `).join("") : `<p class="warn">No job-seekers in this district yet. Ask candidates to login as Employer.</p>`}
    `;
    $("back-dash").addEventListener("click", () => {
      state.step = "dashboard";
      renderInvestor();
    });
    return;
  }

  const d = state.district;
  const subs = subsidiesFor(state.product, d);
  crumbs.textContent = `Bihar → ${state.product} → ${d.name}`;
  body.innerHTML = `
    <div class="dash-head">
      <div>
        <h2>${d.name}</h2>
        <p class="sub">${state.product} cluster · ${d.notes || d.products.join(", ") || "Limited mapped commodities"}</p>
      </div>
      <button class="hire-btn" id="open-hire">Hire workforce</button>
    </div>
    <div class="stats">
      <div class="stat"><span>Nearest highway</span><strong>${d.highway}</strong></div>
      <div class="stat"><span>Nearest water source</span><strong>${d.water}</strong></div>
      <div class="stat"><span>Indicative LT industrial energy</span><strong>₹7.79 / kVAh</strong></div>
      <div class="stat"><span>Irrigation (metered IAS-I)</span><strong>₹6.74 / unit</strong></div>
    </div>
    <div class="field-block">
      <h3>Government subsidies & incentives</h3>
      <p class="sub">Official-scheme style summary for Bihar industry & agri-processing. Confirm latest notifications before investment.</p>
      ${subs.map((s) => `<div class="subsidy"><h4>${s.title}</h4><p>${s.body}</p></div>`).join("")}
    </div>
    <div class="field-block">
      <h3>Electricity rates in ${d.name}</h3>
      <p class="sub">${ELECTRICITY.source}. Tariff is statewide; shown here for this district desk.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Category (investor-relevant)</th><th>Fixed charge</th><th>Energy charge</th></tr></thead>
          <tbody>
            ${ELECTRICITY.investorFocus.map((r) => `<tr><td>${r.name}</td><td>${r.fixed}</td><td>${r.energy}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
      <p class="note" style="margin-top:12px">Other approved categories</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Category</th><th>Fixed charge</th><th>Energy charge</th></tr></thead>
          <tbody>
            ${ELECTRICITY.other.map((r) => `<tr><td>${r.name}</td><td>${r.fixed}</td><td>${r.energy}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>
    <button class="btn secondary" id="back-dist" type="button">Back to district list</button>
  `;
  $("open-hire").addEventListener("click", () => {
    state.step = "hire";
    renderInvestor();
  });
  $("back-dist").addEventListener("click", () => {
    state.step = "districts";
    state.district = null;
    renderInvestor();
  });
}

loadSeekers();
