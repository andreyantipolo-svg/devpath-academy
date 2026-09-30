// Pure parsing helpers for the AI layer (unit-tested in Node).

/** Incremental Server-Sent-Events parser: push() raw text chunks, get { event, data } callbacks. */
export function createSSEParser(onEvent) {
  let buffer = '';
  const flush = (block) => {
    let event = 'message';
    const dataLines = [];
    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) event = line.slice(6).trim();
      else if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart());
    }
    if (!dataLines.length) return;
    const raw = dataLines.join('\n');
    let data = raw;
    try {
      data = JSON.parse(raw);
    } catch {
      /* keep raw text */
    }
    onEvent({ event, data });
  };
  return {
    push(text) {
      buffer += text.replace(/\r\n/g, '\n');
      let idx;
      while ((idx = buffer.indexOf('\n\n')) >= 0) {
        flush(buffer.slice(0, idx));
        buffer = buffer.slice(idx + 2);
      }
    },
    end() {
      if (buffer.trim()) flush(buffer);
      buffer = '';
    },
  };
}

/** Pull the first JSON object out of a model reply, tolerating code fences and chatter. */
export function extractJSON(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('No JSON found in the reply');
  return JSON.parse(candidate.slice(start, end + 1));
}

/** Validate AI-written multiple-choice questions; drop malformed ones instead of crashing. */
export function validateQuestions(payload) {
  const list = Array.isArray(payload?.questions) ? payload.questions : [];
  return list
    .filter(
      (x) =>
        x &&
        typeof x.q === 'string' &&
        Array.isArray(x.o) &&
        x.o.length >= 2 &&
        x.o.every((o) => typeof o === 'string') &&
        Number.isInteger(x.a) &&
        x.a >= 0 &&
        x.a < x.o.length,
    )
    .map((x) => ({ q: x.q, o: x.o, a: x.a, why: typeof x.why === 'string' ? x.why : '' }));
}
