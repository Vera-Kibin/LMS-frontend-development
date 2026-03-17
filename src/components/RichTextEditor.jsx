import { useEffect, useRef } from "react";
import { sanitizeHtml } from "../utils/sanitize.jsx";

export default function RichTextEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const current = ref.current.innerHTML;
    if ((value || "") !== current) ref.current.innerHTML = value || "";
  }, [value]);

  function emit() {
    const html = ref.current?.innerHTML || "";
    onChange(sanitizeHtml(html));
  }

  function cmd(command) {
    document.execCommand(command);
    emit();
  }

  function addLink() {
    const url = prompt("Link (https://...)");
    if (!url) return;
    document.execCommand("createLink", false, url);
    emit();
  }

  return (
    <div className="rte">
      <div className="rte__toolbar">
        <button type="button" className="btn-ghost" onClick={() => cmd("bold")}>
          B
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => cmd("italic")}
        >
          I
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => cmd("insertUnorderedList")}
        >
          • List
        </button>
        <button type="button" className="btn-ghost" onClick={addLink}>
          Link
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => cmd("removeFormat")}
        >
          Tx
        </button>
      </div>

      <div
        className="rte__box"
        ref={ref}
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder || "Napisz…"}
        onInput={emit}
        onBlur={emit}
      />
    </div>
  );
}
