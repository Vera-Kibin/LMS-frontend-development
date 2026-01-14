import { useMemo, useState } from "react";
import RichTextEditor from "./RichTextEditor.jsx";

function buildTree(comments) {
  const byId = new Map();
  const roots = [];

  comments.forEach((c) => byId.set(c.id, { ...c, children: [] }));
  byId.forEach((node) => {
    if (!node.parentId) roots.push(node);
    else {
      const parent = byId.get(node.parentId);
      if (parent) parent.children.push(node);
      else roots.push(node);
    }
  });

  const sort = (nodes) => {
    nodes.sort((a, b) => a.createdAt - b.createdAt);
    nodes.forEach((n) => sort(n.children));
  };
  sort(roots);

  return roots;
}

function CommentNode({ node, depth, onReply }) {
  const [open, setOpen] = useState(false);
  const [html, setHtml] = useState("");

  return (
    <div className="cnode" style={{ marginLeft: depth * 16 }}>
      <div className="cnode__meta">
        <strong>{node.author?.name || "Anon"}</strong>{" "}
        <span className="muted">
          {new Date(node.createdAt).toLocaleString()}
        </span>
      </div>

      <div
        className="cnode__body"
        dangerouslySetInnerHTML={{ __html: node.content?.html || "" }}
      />

      <div className="cnode__actions">
        <button
          className="btn-ghost"
          type="button"
          onClick={() => setOpen((s) => !s)}
        >
          {open ? "Anuluj" : "Odpowiedz"}
        </button>
      </div>

      {open && (
        <div className="cnode__reply">
          <RichTextEditor
            value={html}
            onChange={setHtml}
            placeholder="Twoja odpowiedź…"
          />
          <div className="cnode__replyActions">
            <button
              className="btn"
              type="button"
              onClick={() => {
                if (!html || html.trim() === "") return;
                onReply(node.id, html);
                setHtml("");
                setOpen(false);
              }}
            >
              Dodaj odpowiedź
            </button>
          </div>
        </div>
      )}

      {node.children?.map((ch) => (
        <CommentNode
          key={ch.id}
          node={ch}
          depth={depth + 1}
          onReply={onReply}
        />
      ))}
    </div>
  );
}

export default function CommentsTree({ comments, onAddReply }) {
  const tree = useMemo(() => buildTree(comments || []), [comments]);

  return (
    <div className="ctree">
      {tree.map((n) => (
        <CommentNode key={n.id} node={n} depth={0} onReply={onAddReply} />
      ))}
    </div>
  );
}
