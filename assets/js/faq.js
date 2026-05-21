/* faq.js — 자주 묻는 질문 (정적) */
document.addEventListener("data:ready", (e) => {
  const d = e.detail, { won, eok } = window.fmt;
  const minP = Math.min(...d.units.flatMap((u) => u.floors.map((f) => f.price)));
  const maxP = Math.max(...d.units.flatMap((u) => u.floors.map((f) => f.price)));
  const faqs = [
    ["청약 일정이 어떻게 되나요?",
      `입주자모집공고일 2026.04.30 → 특별공급 접수 5.11 → 일반공급 1순위 5.12(해당지역)·5.13(기타지역) → 2순위 5.14 → 당첨자 발표 5.20 → 서류접수 5.29~6.3 → 계약 7.9~7.11 입니다. 자세한 일정은 <a href="#schedule">청약일정</a>을 보세요.`],
    ["분양가는 얼마인가요?",
      `타입·층에 따라 약 ${eok(minP)} ~ ${eok(maxP)} 수준입니다(발코니 확장·옵션 별도). <a href="#calc">분양가 계산기</a>에서 타입·층·옵션별 총액과 회차별 납부액을 확인할 수 있어요.`],
    ["일반공급 1순위 자격은?",
      `${d.criteria.rank1} 이어야 합니다. 또한 안양시 2년 이상 거주자가 ‘해당지역’으로 우선공급됩니다.`],
    ["안양 거주 2년이 안 되면 청약을 못 하나요?",
      "할 수 있습니다. 안양 2년 미만 거주자 및 서울·인천·경기 거주자는 ‘기타지역’으로 신청하며, 해당지역(안양 2년 이상) 신청자보다 후순위로 공급됩니다."],
    ["발코니 확장은 필수인가요?",
      `발코니 확장은 선택 사항입니다. 타입별 확장비는 84A ${won(d.options.balcony.byType["84A"])} ~ 84D ${won(d.options.balcony.byType["84D"])} 이며, 계약금 20% + 잔금 80%로 납부합니다.`],
    ["중도금 대출이 되나요?",
      "중도금은 정부 규제(LTV 등)에 따라 일부 범위 내에서 유이자로 융자 알선될 수 있으며, 대출 가능 여부·조건은 정부정책·금융기관 사정에 따라 달라집니다. 자세한 내용은 <a href=\"#chat\">공고문 검색</a>에서 ‘중도금 대출’을 검색하세요."],
    ["재당첨 제한·전매 제한은?",
      `재당첨제한 ${d.meta.rules.재당첨제한}, 전매제한 ${d.meta.rules.전매제한}이 적용됩니다(분양가상한제 적용주택). 거주의무기간은 ${d.meta.rules.거주의무}입니다.`],
    ["입주는 언제인가요?", `${d.meta.moveInPlan}입니다. 공정에 따라 변동될 수 있으며 정확한 시기는 추후 개별 안내됩니다.`],
    ["견본주택은 어디서 보나요?",
      `${d.meta.showHouse.address}에서 ${d.meta.showHouse.period} 운영합니다(견본세대 84D). ${d.meta.showHouse.note}.`],
  ];
  document.getElementById("faqList").innerHTML = faqs.map(([q, ans]) =>
    `<div class="faq-item"><div class="faq-q">${q}<span class="ar">▾</span></div><div class="faq-a">${ans}</div></div>`).join("");
  document.querySelectorAll(".faq-item").forEach((it) =>
    it.querySelector(".faq-q").addEventListener("click", () => it.classList.toggle("open")));
});
