/* =========================================================
   TECH NO DIA DIA — Interações
   ========================================================= */

(() => {
  "use strict";

  /* Troque o número abaixo pelo WhatsApp real (DDI + DDD + número).
     Ex.: 5521999999999 */
  const WHATSAPP = "5579981173409";

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

  const numberBR = (value, decimals = 0) =>
    new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);

  const waLink = (message) =>
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const normalize = (value) =>
    String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  /* ---------- Ano do rodapé ---------- */

  const year = $("#year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* ---------- Cabeçalho com estado ao rolar ---------- */

  const header = $("#siteHeader");
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* ---------- Menu mobile ---------- */

  const nav = $("#nav");
  const navToggle = $("#navToggle");

  if (nav && navToggle) {
    const closeMenu = () => {
      nav.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menu");
      document.body.classList.remove("nav-open");
    };

    navToggle.addEventListener("click", () => {
      const willOpen = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", willOpen);
      navToggle.classList.toggle("is-open", willOpen);
      navToggle.setAttribute("aria-expanded", String(willOpen));
      navToggle.setAttribute("aria-label", willOpen ? "Fechar menu" : "Abrir menu");
      document.body.classList.toggle("nav-open", willOpen);
    });

    $$("a", nav).forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---------- Animações de entrada ---------- */

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealElements = $$("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("in-view"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  /* ---------- Números animados ---------- */

  const counters = $$("[data-count]");

  if (counters.length) {
    const animateCounter = (element) => {
      const target = Number.parseFloat(element.dataset.count);
      const decimals = Number.parseInt(element.dataset.decimals || "0", 10);
      const prefix = element.dataset.prefix || "";
      const suffix = element.dataset.suffix || "";

      if (Number.isNaN(target)) return;

      if (reduceMotion) {
        element.textContent = `${prefix}${numberBR(target, decimals)}${suffix}`;
        return;
      }

      const duration = 1300;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        element.textContent = `${prefix}${numberBR(current, decimals)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          element.textContent = `${prefix}${numberBR(target, decimals)}${suffix}`;
        }
      };

      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
    } else {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );

      counters.forEach((counter) => counterObserver.observe(counter));
    }
  }

  /* ---------- FAQ ---------- */

  const faqItems = $$(".faq__item");

  faqItems.forEach((item) => {
    const button = $(".faq__q", item);
    if (!button) return;

    button.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");

      faqItems.forEach((otherItem) => {
        if (otherItem === item) return;
        otherItem.classList.remove("is-open");
        const otherButton = $(".faq__q", otherItem);
        if (otherButton) otherButton.setAttribute("aria-expanded", "false");
      });

      item.classList.toggle("is-open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
    });
  });

  /* ---------- Simulador de atendimento (página inicial) ---------- */

  const simForm = $("#simForm");
  const simProblem = $("#simProblem");
  const simArea = $("#simArea");

  if (simForm && simProblem && simArea) {
    const simEquip = $("#simEquip");
    const simEstimate = $("#simEstimate");
    const simRange = $("#simRange");
    const simDetail = $("#simDetail");
    const simWa = $("#simWa");
    const simAlert = $("#simAlert");

    const problems = {
      "nao-liga": {
        label: "Equipamento não liga",
        range: [160, 340],
        parts: true,
      },
      lento: {
        label: "Lentidão e travamentos",
        range: [110, 210],
        parts: false,
      },
      tela: {
        label: "Tela ou teclado com defeito",
        range: [180, 450],
        parts: true,
      },
      virus: {
        label: "Vírus ou sistema comprometido",
        range: [100, 190],
        parts: false,
      },
      upgrade: {
        label: "Upgrade de SSD ou memória",
        range: [190, 380],
        parts: true,
      },
      rede: {
        label: "Wi-Fi e rede",
        range: [110, 230],
        parts: false,
      },
      impressora: {
        label: "Impressora",
        range: [90, 190],
        parts: false,
      },
      backup: {
        label: "Backup e arquivos",
        range: [140, 300],
        parts: false,
      },
      outro: {
        label: "Outro problema",
        range: [100, 260],
        parts: false,
      },
    };

    const equipAdjustment = {
      notebook: 25,
      desktop: 0,
      impressora: -25,
      rede: 10,
      outro: 0,
    };

    const urgencyLabels = {
      hoje: "Hoje, se houver disponibilidade",
      semana: "Esta semana",
      flexivel: "Sem pressa, pode agendar",
    };

    const showAlert = (message) => {
      if (!simAlert) return;
      simAlert.textContent = message;
      simAlert.classList.add("is-visible");
    };

    const hideAlert = () => {
      if (!simAlert) return;
      simAlert.classList.remove("is-visible");
    };

    simArea.addEventListener("change", () => {
      simArea.classList.remove("is-invalid");
      hideAlert();
    });

    simForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!simArea.value) {
        simArea.classList.add("is-invalid");
        simArea.focus();
        showAlert("Selecione seu bairro para direcionar o atendimento.");
        return;
      }

      hideAlert();

      const problem = problems[simProblem.value] || problems.outro;
      const equipmentValue = simEquip ? simEquip.value : "outro";
      const equipmentLabel = simEquip
        ? simEquip.options[simEquip.selectedIndex].text
        : "Equipamento";
      const selectedArea = simArea.options[simArea.selectedIndex];
      const areaGroup = selectedArea.parentElement;
      const areaLabel =
        areaGroup && areaGroup.tagName === "OPTGROUP"
          ? `${selectedArea.text} — ${areaGroup.label}`
          : selectedArea.text;
      const urgency = $('input[name="simUrgency"]:checked');
      const urgencyLabel = urgency
        ? urgencyLabels[urgency.value] || urgency.value
        : "A combinar";

      const adjustment = equipAdjustment[equipmentValue] ?? 0;
      let min = Math.max(80, Math.round((problem.range[0] + adjustment) / 10) * 10);
      let max = Math.max(min + 40, Math.round((problem.range[1] + adjustment) / 10) * 10);

      if (simRange) {
        simRange.textContent = `${brl.format(min)} a ${brl.format(max)}`;
      }

      const partsNote = problem.parts
        ? "Peças e componentes são orçados à parte, se necessários."
        : "Peças, quando necessárias, são informadas antes do serviço.";

      if (simDetail) {
        simDetail.textContent = `${problem.label} em ${equipmentLabel.toLowerCase()}. Estimativa de mão de obra para atendimento em ${areaLabel}. ${partsNote}`;
      }

      if (simWa) {
        const message = [
          "Olá, Tech no Dia Dia! Quero agendar um atendimento.",
          "",
          `• Equipamento: ${equipmentLabel}`,
          `• Problema: ${problem.label}`,
          `• Bairro: ${areaLabel}`,
          `• Urgência: ${urgencyLabel}`,
          `• Estimativa no site: ${brl.format(min)} a ${brl.format(max)}`,
          "",
          "Podemos confirmar a visita?",
        ].join("\n");

        simWa.href = waLink(message);
      }

      if (simEstimate) {
        simEstimate.hidden = false;
        simEstimate.style.animation = "none";
        void simEstimate.offsetWidth;
        simEstimate.style.animation = "";
        window.setTimeout(() => {
          simEstimate.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 80);
      }
    });
  }

  /* Atalhos dos cards de serviço para o simulador */
  $$("[data-prefill]").forEach((link) => {
    link.addEventListener("click", () => {
      const target = link.dataset.prefill;
      if (!simProblem || !target) return;
      const optionExists = Array.from(simProblem.options).some(
        (option) => option.value === target
      );
      if (optionExists) {
        simProblem.value = target;
      }
    });
  });

  /* ---------- Consulta de bairro ---------- */

  const coverageForm = $("#coverageForm");

  if (coverageForm) {
    const coverageInput = $("#coverageInput");
    const coverageResult = $("#coverageResult");

    const areas = {
      "Niterói": [
        "Centro",
        "Icaraí",
        "Ingá",
        "Santa Rosa",
        "São Domingos",
        "Boa Viagem",
        "Charitas",
        "Jurujuba",
        "Barreto",
        "Fonseca",
        "Engenhoca",
        "Largo da Batalha",
        "Pendotiba",
        "Itaipu",
        "Piratininga",
        "Camboinhas",
        "Maria Paula",
        "Rio do Ouro",
        "Cubango",
        "Fátima",
        "Vital Brazil",
      ],
      "São Gonçalo": [
        "Centro",
        "Alcântara",
        "Neves",
        "Trindade",
        "Zé Garoto",
        "Mutuá",
        "Laranjal",
        "Colubandê",
        "Barro Vermelho",
        "Rocha",
        "São Miguel",
        "Itaúna",
        "Ipiíba",
        "Venda da Cruz",
        "Boaçu",
        "Arsenal",
        "Porto do Rosa",
        "Jardim Catarina",
        "Gradim",
        "Pacheco",
        "Amendoeira",
        "Tribobó",
      ],
    };

    const findArea = (query, preferredCity = null) => {
      const normalizedQuery = normalize(query);
      if (!normalizedQuery) return null;

      const cityOrder = preferredCity
        ? [preferredCity, ...Object.keys(areas).filter((city) => city !== preferredCity)]
        : Object.keys(areas);

      for (const city of cityOrder) {
        const neighborhoods = areas[city];
        const exact = neighborhoods.find(
          (neighborhood) => normalize(neighborhood) === normalizedQuery
        );
        if (exact) return { city, neighborhood: exact };

        const startsWith = neighborhoods.find((neighborhood) =>
          normalize(neighborhood).startsWith(normalizedQuery)
        );
        if (startsWith) return { city, neighborhood: startsWith };
      }

      return null;
    };

    const renderCoverageResult = (query, preferredCity = null) => {
      if (!coverageResult) return;

      const found = findArea(query, preferredCity);

      if (!query.trim()) {
        coverageResult.className = "coverage-result coverage-result--miss";
        coverageResult.innerHTML = `
          <div class="coverage-result__text">
            <svg class="icon" aria-hidden="true"><use href="#i-pin"></use></svg>
            <div>Digite o nome do seu bairro para verificarmos a disponibilidade.</div>
          </div>`;
        return;
      }

      if (found) {
        const message = `Olá, Tech no Dia Dia! Vi que atendem em ${found.neighborhood} (${found.city}) e quero agendar uma visita. Meu problema é:`;
        coverageResult.className = "coverage-result";
        coverageResult.innerHTML = `
          <div class="coverage-result__text">
            <svg class="icon" aria-hidden="true"><use href="#i-check"></use></svg>
            <div>
              <strong>Boa notícia! Atendemos em ${escapeHtml(found.neighborhood)} — ${escapeHtml(found.city)}.</strong>
              <small>Atendimento presencial com horário agendado. Visita técnica a partir de R$ 80, abatida do serviço.</small>
            </div>
          </div>
          <a class="btn btn--lime btn--sm" href="${waLink(message)}" target="_blank" rel="noopener">
            Agendar em ${escapeHtml(found.neighborhood)}
            <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"></use></svg>
          </a>`;
        return;
      }

      const normalizedQuery = normalize(query);
      const suggestions = [];

      Object.entries(areas).forEach(([city, neighborhoods]) => {
        neighborhoods.forEach((neighborhood) => {
          if (normalize(neighborhood).includes(normalizedQuery)) {
            suggestions.push(`${neighborhood} (${city})`);
          }
        });
      });

      const message = `Olá, Tech no Dia Dia! Quero confirmar se atendem no bairro ${query}.`;
      const suggestionText = suggestions.length
        ? ` Você quis dizer ${suggestions.slice(0, 3).map(escapeHtml).join(" ou ")}?`
        : "";

      coverageResult.className = "coverage-result coverage-result--miss";
      coverageResult.innerHTML = `
        <div class="coverage-result__text">
          <svg class="icon" aria-hidden="true"><use href="#i-pin"></use></svg>
          <div>
            <strong>Não encontramos “${escapeHtml(query)}” na lista principal.</strong>
            <small>Ainda podemos atender casos próximos.${suggestionText} Chame no WhatsApp para confirmar a disponibilidade.</small>
          </div>
        </div>
        <a class="btn btn--outline btn--sm" href="${waLink(message)}" target="_blank" rel="noopener">
          Consultar disponibilidade
          <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"></use></svg>
        </a>`;
    };

    coverageForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!coverageInput) return;
      renderCoverageResult(coverageInput.value);
    });

    $$(".area-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        if (!coverageInput) return;
        coverageInput.value = chip.dataset.area || chip.textContent.trim();
        renderCoverageResult(coverageInput.value, chip.dataset.city || null);
        const check = $("#coverageCheck");
        if (check) {
          check.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    });
  }

  /* ---------- Calculadora de segurança (segunda página) ---------- */

  const secForm = $("#secForm");

  if (secForm) {
    const secCameras = $("#secCameras");
    const camOptions = $("#camOptions");
    const camQty = $("#camQty");
    const secProperty = $("#secProperty");
    const secEstimate = $("#secEstimate");
    const secRange = $("#secRange");
    const secDetail = $("#secDetail");
    const secWa = $("#secWa");
    const secAlert = $("#secAlert");

    const servicePrices = {
      seguranca: { range: [90, 150], label: "Programas de segurança" },
      remoto: { range: [70, 120], label: "Acesso remoto seguro" },
      virus: { range: [100, 190], label: "Remoção de vírus e malware" },
    };

    const cameraPrices = {
      "2": [350, 550],
      "4": [550, 850],
      "6": [800, 1200],
      "8": [1100, 1700],
    };

    const urgencyLabels = {
      hoje: "Hoje, se houver disponibilidade",
      semana: "Esta semana",
      flexivel: "Sem pressa, pode agendar",
    };

    const syncCamOptions = () => {
      if (!camOptions || !secCameras) return;
      camOptions.hidden = !secCameras.checked;
    };

    if (secCameras) {
      secCameras.addEventListener("change", syncCamOptions);
      syncCamOptions();
    }

    secForm.addEventListener("change", (event) => {
      if (event.target.matches('input[name="secService"]')) {
        if (secAlert) secAlert.classList.remove("is-visible");
      }
    });

    secForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const selected = $$('input[name="secService"]:checked', secForm).map(
        (input) => input.value
      );

      if (!selected.length) {
        if (secAlert) {
          secAlert.textContent = "Selecione pelo menos um serviço para calcular a estimativa.";
          secAlert.classList.add("is-visible");
        }
        return;
      }

      if (secAlert) secAlert.classList.remove("is-visible");

      let min = 0;
      let max = 0;
      const serviceLabels = [];

      selected.forEach((value) => {
        if (value === "cameras") {
          if (!camQty) return;
          const range = cameraPrices[camQty.value] || cameraPrices["2"];
          min += range[0];
          max += range[1];
          const quantityLabel = camQty.options[camQty.selectedIndex].text;
          serviceLabels.push(`Câmeras CFTV/IP (${quantityLabel})`);
          return;
        }

        const service = servicePrices[value];
        if (!service) return;
        min += service.range[0];
        max += service.range[1];
        serviceLabels.push(service.label);
      });

      const isCommercial = secProperty && secProperty.value === "comercio";
      if (isCommercial && selected.includes("cameras")) {
        min *= 1.15;
        max *= 1.15;
      }

      min = Math.round(min / 10) * 10;
      max = Math.round(max / 10) * 10;

      if (secRange) {
        secRange.textContent = `${brl.format(min)} a ${brl.format(max)}`;
      }

      const propertyLabel =
        secProperty && secProperty.value === "comercio" ? "Comércio" : "Residência";

      if (secDetail) {
        const cameraNote = selected.includes("cameras")
          ? " Projeto de câmeras com instalação, configuração de DVR/NVR e acesso pelo celular. Equipamentos e cabeamento são orçados à parte."
          : "";

        secDetail.textContent = `${serviceLabels.join(" + ")}. Atendimento para ${propertyLabel.toLowerCase()} em Niterói ou São Gonçalo, com configuração e testes no local.${cameraNote}`;
      }

      if (secWa) {
        const urgency = $('input[name="secUrgency"]:checked');
        const urgencyLabel = urgency
          ? urgencyLabels[urgency.value] || urgency.value
          : "A combinar";

        const message = [
          "Olá, Tech no Dia Dia! Quero um orçamento de segurança.",
          "",
          `• Serviços: ${serviceLabels.join(", ")}`,
          `• Tipo de imóvel: ${propertyLabel}`,
          ...(selected.includes("cameras") && camQty
            ? [`• Câmeras: ${camQty.options[camQty.selectedIndex].text}`]
            : []),
          `• Urgência: ${urgencyLabel}`,
          `• Estimativa no site: ${brl.format(min)} a ${brl.format(max)}`,
          "",
          "Podemos detalhar o projeto?",
        ].join("\n");

        secWa.href = waLink(message);
      }

      if (secEstimate) {
        secEstimate.hidden = false;
        secEstimate.style.animation = "none";
        void secEstimate.offsetWidth;
        secEstimate.style.animation = "";
        window.setTimeout(() => {
          secEstimate.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 80);
      }
    });

    /* Atalho dos cards de serviço de segurança */
    $$("[data-sec]").forEach((link) => {
      link.addEventListener("click", () => {
        const value = link.dataset.sec;
        if (!value) return;

        const boxes = $$('input[name="secService"]', secForm);
        boxes.forEach((input) => {
          input.checked = false;
        });

        const box = boxes.find((input) => input.value === value);
        if (!box) return;

        box.checked = true;
        box.dispatchEvent(new Event("change", { bubbles: true }));
        syncCamOptions();

        if (secEstimate) secEstimate.hidden = true;
        if (secAlert) secAlert.classList.remove("is-visible");
      });
    });
  }

  /* ---------- Esconde o WhatsApp flutuante sobre CTAs e rodapé ---------- */

  const waFloat = $(".wa-float");
  const waHideTargets = $$(".cta-band, .site-footer");

  if (waFloat && waHideTargets.length && "IntersectionObserver" in window) {
    const visibleTargets = new Set();

    const waObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleTargets.add(entry.target);
          else visibleTargets.delete(entry.target);
        });
        waFloat.classList.toggle("is-hidden", visibleTargets.size > 0);
      },
      { threshold: 0.04 }
    );

    waHideTargets.forEach((target) => waObserver.observe(target));
  }

  /* ---------- Centraliza o número de WhatsApp nos links estáticos ---------- */

  $$('a[href*="wa.me/"]').forEach((link) => {
    try {
      const url = new URL(link.href);
      const message =
        url.searchParams.get("text") ||
        "Olá! Vim pelo site da Tech no Dia Dia e gostaria de agendar um atendimento.";
      link.href = waLink(message);
    } catch (error) {
      /* Mantém o link original caso a URL não possa ser lida. */
    }
  });
})();
