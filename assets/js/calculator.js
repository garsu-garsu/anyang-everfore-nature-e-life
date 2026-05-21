/* calculator.js — 분양가 + 발코니 + 시스템에어컨 합산, 회차별 납부 일정 */
document.addEventListener("data:ready", (e) => {
  const d = e.detail;
  const { won, eok, fmtDate } = window.fmt;
  const state = { type: d.units[0].type, floorIdx: 0, balcony: true, aircon: "" };

  const typeWrap = document.getElementById("calcType");
  const floorWrap = document.getElementById("calcFloor");
  const airconSel = document.getElementById("optAircon");
  const balconyChk = document.getElementById("optBalcony");

  typeWrap.innerHTML = d.units.map((u) =>
    `<button data-type="${u.type}">${u.type}${u.isModel ? " ★" : ""}</button>`).join("");
  d.options.aircon.items.forEach((it) => {
    const o = document.createElement("option");
    o.value = it.id; o.textContent = `${it.label} (+${won(it.price)})`;
    airconSel.appendChild(o);
  });

  function unit() { return d.units.find((u) => u.type === state.type); }

  function renderFloors() {
    const u = unit();
    floorWrap.innerHTML = u.floors.map((f, i) =>
      `<button data-floor="${i}">${f.tier}</button>`).join("");
    floorWrap.querySelectorAll("button").forEach((b) =>
      b.classList.toggle("sel", +b.dataset.floor === state.floorIdx));
  }

  function compute() {
    const u = unit();
    const floor = u.floors[state.floorIdx];
    const base = floor.price;
    const balcony = state.balcony ? d.options.balcony.byType[state.type] : 0;
    const airItem = d.options.aircon.items.find((i) => i.id === state.aircon);
    const aircon = airItem ? airItem.price : 0;
    const total = base + balcony + aircon;

    // 분양가 납부: 계약금10 / 중도금 6x10 / 잔금30
    const p = d.payment;
    const rows = [];
    rows.push({ stage: "계약금", when: "계약 시", base: base * 0.1, balcony: balcony * d.options.balcony.payment.계약금, aircon: aircon * d.options.aircon.payment.계약금 });
    p.중도금.installments.forEach((inst) => {
      rows.push({ stage: `중도금 ${inst.no}회`, when: fmtDate(inst.date), base: base * inst.ratio, balcony: 0, aircon: aircon * (d.options.aircon.payment.중도금 / 6) });
    });
    rows.push({ stage: "잔금", when: "입주 시(2028.08)", base: base * 0.3, balcony: balcony * d.options.balcony.payment.잔금, aircon: aircon * d.options.aircon.payment.잔금 });

    return { base, balcony, aircon, total, rows, fund: d.payment.잔금.housingFund };
  }

  function render() {
    renderFloors();
    typeWrap.querySelectorAll("button").forEach((b) => b.classList.toggle("sel", b.dataset.type === state.type));
    document.getElementById("balconyPrice").textContent = "+" + won(d.options.balcony.byType[state.type]);

    const c = compute();
    document.getElementById("calcTotal").textContent = eok(c.total);
    document.getElementById("calcBreak").innerHTML =
      `<span>분양가 ${won(c.base)}</span>` +
      (c.balcony ? `<span>+ 발코니 ${won(c.balcony)}</span>` : "") +
      (c.aircon ? `<span>+ 에어컨 ${won(c.aircon)}</span>` : "") +
      `<span>· 잔금 중 주택도시기금 융자 가능 ${won(c.fund)}</span>`;

    const tb = document.getElementById("payTable");
    const head = `<tr><th>구분</th><th>납부 시기</th><th>분양가</th>${c.balcony ? "<th>발코니</th>" : ""}${c.aircon ? "<th>에어컨</th>" : ""}<th>합계</th></tr>`;
    const body = c.rows.map((r) => {
      const sum = r.base + r.balcony + r.aircon;
      return `<tr><td class="stage">${r.stage}</td><td style="text-align:left;color:var(--gray-500)">${r.when}</td>
        <td>${r.base ? won(Math.round(r.base)) : "-"}</td>
        ${c.balcony ? `<td>${r.balcony ? won(Math.round(r.balcony)) : "-"}</td>` : ""}
        ${c.aircon ? `<td>${r.aircon ? won(Math.round(r.aircon)) : "-"}</td>` : ""}
        <td><strong>${won(Math.round(sum))}</strong></td></tr>`;
    }).join("");
    const totalRow = `<tr class="sum"><td>총 합계</td><td></td><td>${won(c.base)}</td>${c.balcony ? `<td>${won(c.balcony)}</td>` : ""}${c.aircon ? `<td>${won(c.aircon)}</td>` : ""}<td>${won(c.total)}</td></tr>`;
    tb.innerHTML = head + body + totalRow;
  }

  typeWrap.addEventListener("click", (ev) => {
    const b = ev.target.closest("button"); if (!b) return;
    state.type = b.dataset.type; state.floorIdx = 0; render();
  });
  floorWrap.addEventListener("click", (ev) => {
    const b = ev.target.closest("button"); if (!b) return;
    state.floorIdx = +b.dataset.floor; render();
  });
  balconyChk.addEventListener("change", () => { state.balcony = balconyChk.checked; render(); });
  airconSel.addEventListener("change", () => { state.aircon = airconSel.value; render(); });

  render();
});
