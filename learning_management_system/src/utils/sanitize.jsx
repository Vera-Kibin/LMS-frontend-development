const ALLOWED_TAGS = new Set([
  "B",
  "STRONG",
  "I",
  "EM",
  "A",
  "UL",
  "OL",
  "LI",
  "P",
  "BR",
]);

function isSafeHref(href) {
  const h = String(href || "").trim();
  return (
    h.startsWith("http://") ||
    h.startsWith("https://") ||
    h.startsWith("mailto:")
  );
}

export function sanitizeHtml(dirtyHtml) {
  const input = String(dirtyHtml ?? "");
  const tpl = document.createElement("template");
  tpl.innerHTML = input;

  const walk = (node) => {
    // Копируем массив, потому что будем менять дерево
    const children = Array.from(node.childNodes);

    for (const child of children) {
      // Текстовые узлы оставляем
      if (child.nodeType === Node.TEXT_NODE) continue;

      // Комментарии/прочее — удаляем
      if (child.nodeType !== Node.ELEMENT_NODE) {
        child.remove();
        continue;
      }

      const el = child;

      // Запрещённый тег: заменяем на текст (безопасно и просто)
      if (!ALLOWED_TAGS.has(el.tagName)) {
        const text = document.createTextNode(el.textContent || "");
        el.replaceWith(text);
        continue;
      }

      // Чистим атрибуты
      if (el.tagName === "A") {
        const href = el.getAttribute("href") || "";
        if (!isSafeHref(href)) el.removeAttribute("href");

        el.setAttribute("rel", "noreferrer noopener");
        el.setAttribute("target", "_blank");

        // удаляем всё лишнее кроме href/rel/target
        for (const attr of Array.from(el.attributes)) {
          const keep = ["href", "rel", "target"].includes(attr.name);
          if (!keep) el.removeAttribute(attr.name);
        }
      } else {
        // остальные теги — вообще без атрибутов
        for (const attr of Array.from(el.attributes)) {
          el.removeAttribute(attr.name);
        }
      }

      // рекурсия
      walk(el);
    }
  };

  walk(tpl.content);

  return tpl.innerHTML || "";
}
