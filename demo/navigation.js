(function () {
  const routeRules = [
    ["dashboard", "dashboard.html"],
    ["overview", "dashboard.html"],
    ["reading", "reading.html"],
    ["listening", "listening.html"],
    ["speaking", "speaking.html"],
    ["writing", "dashboard.html"],
    ["practice", "reading.html"],
    ["results", "dashboard.html"],
    ["resources", "listening.html"],
  ];

  function normalizeText(element) {
    return (element.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function routeFromText(text) {
    const rule = routeRules.find(([keyword]) => text.includes(keyword));
    return rule ? rule[1] : "";
  }

  document.querySelectorAll("a").forEach((link) => {
    const route = routeFromText(normalizeText(link));
    if (route) {
      link.href = route;
    }
  });

  document.querySelectorAll("button").forEach((button) => {
    const text = normalizeText(button);
    let route = routeFromText(text);

    if (!route && text.includes("join now")) {
      route = "dashboard.html";
    }

    if (!route && (text.includes("start mock test") || text.includes("resume test"))) {
      route = "reading.html";
    }

    if (route) {
      button.type = "button";
      button.addEventListener("click", () => {
        window.location.href = route;
      });
    }
  });
})();
