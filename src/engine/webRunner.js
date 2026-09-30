// HTML/CSS tasks render in a sandboxed iframe (scripts allowed, no same-origin access).
// Each task supplies DOM assertions as JS expressions; they run inside the frame after load.

const esc = (json) => json.replace(/</g, '\\u003c');

export function buildPreviewDoc(html) {
  return html;
}

export function buildTestDoc(html, tests, token) {
  const script = `<script>
addEventListener('load', function () {
  var tests = ${esc(JSON.stringify(tests))};
  var results = tests.map(function (t) {
    try { return { desc: t.desc, ok: !!(new Function('return (' + t.test + ')'))() }; }
    catch (e) { return { desc: t.desc, ok: false }; }
  });
  parent.postMessage({ source: 'devpath-web', token: ${JSON.stringify(token)}, results: results }, '*');
});
</script>`;
  return html + '\n' + script;
}

export function runWebTests(html, tests, timeoutMs = 4000) {
  return new Promise((resolve) => {
    const token = Math.random().toString(36).slice(2);
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.setAttribute('aria-hidden', 'true');
    frame.style.cssText = 'position:fixed;left:-9999px;top:0;width:800px;height:600px;border:0;visibility:hidden';
    let done = false;
    const finish = (payload) => {
      if (done) return;
      done = true;
      window.removeEventListener('message', onMsg);
      clearTimeout(timer);
      frame.remove();
      resolve(payload);
    };
    const onMsg = (e) => {
      if (e.source !== frame.contentWindow) return;
      if (!e.data || e.data.source !== 'devpath-web' || e.data.token !== token) return;
      finish({ ok: true, results: e.data.results });
    };
    const timer = setTimeout(() => finish({ ok: false, error: 'The preview did not finish loading. Check for an unclosed tag or a blocking script.' }), timeoutMs);
    window.addEventListener('message', onMsg);
    frame.srcdoc = buildTestDoc(html, tests, token);
    document.body.appendChild(frame);
  });
}
