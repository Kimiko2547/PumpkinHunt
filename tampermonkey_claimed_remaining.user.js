// ==UserScript==
// @name         Claimed / Remaining Numbers (Tampermonkey)
// @namespace    http://example.com/
// @version      1.0
// @description  Paste JSON {"claimed":[...]} to see Number claimed, Number remaining and the remaining list (1..100).
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const css = `
  #crn-panel {
    position: fixed;
    right: 12px;
    bottom: 12px;
    width: 480px;
    max-width: calc(100vw - 24px);
    background: #fff;
    color: #111;
    border: 1px solid #999;
    border-radius: 6px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.2);
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    z-index: 999999;
  }
  #crn-panel header {
    padding: 8px 10px;
    background: #2b6cb0;
    color: #fff;
    font-weight: 600;
    display:flex;
    justify-content:space-between;
    align-items:center;
    border-top-left-radius:6px;
    border-top-right-radius:6px;
    cursor: move;
  }
  #crn-panel .body { padding: 10px; }
  #crn-panel textarea { width: 100%; box-sizing: border-box; height: 90px; resize: vertical; padding:6px; font-family: monospace; }
  #crn-panel .controls { margin-top:8px; display:flex; gap:8px; }
  #crn-panel button { padding:6px 10px; cursor:pointer; }
  #crn-panel .counts { margin-top:8px; display:flex; gap:12px; }
  #crn-panel pre { margin-top:8px; max-height: 160px; overflow:auto; background:#f7f7f7; padding:8px; border-radius:4px; }
  #crn-close { background:transparent; color:#fff; border:0; font-weight:700; cursor:pointer; }
  `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'crn-panel';
    panel.innerHTML = `
    <header>
      <span>Claimed / Remaining</span>
      <div>
        <button id="crn-close" title="Close" style="margin-right:6px">✕</button>
      </div>
    </header>
    <div class="body">
      <div>Paste JSON input (format: <code>{"claimed":[...]}</code>) and click <strong>Process</strong>:</div>
      <textarea id="crn-input" placeholder='{"claimed":[19,39,99,...]}'></textarea>
      <div class="controls">
        <button id="crn-process">Process</button>
        <button id="crn-empty">Use empty claimed set</button>
        <button id="crn-copy">Copy remaining to clipboard</button>
      </div>
      <div class="counts">
        <div id="crn-claimed">Number claimed: 0</div>
        <div id="crn-remaining-count">Number remaining: 100</div>
      </div>
      <div>Remaining numbers:</div>
      <pre id="crn-output">[]</pre>
    </div>
  `;
    document.body.appendChild(panel);

    const inputEl = panel.querySelector('#crn-input');
    const btnProcess = panel.querySelector('#crn-process');
    const btnEmpty = panel.querySelector('#crn-empty');
    const btnCopy = panel.querySelector('#crn-copy');
    const out = panel.querySelector('#crn-output');
    const lblClaimed = panel.querySelector('#crn-claimed');
    const lblRemainingCount = panel.querySelector('#crn-remaining-count');
    const btnClose = panel.querySelector('#crn-close');

    const ALL = new Set(Array.from({ length: 100 }, (_, i) => i + 1));

    function computeFromSet(excludedSet) {
        const remaining = Array.from(ALL).filter(n => !excludedSet.has(n));
        remaining.sort((a, b) => a - b);
        lblClaimed.textContent = `Number claimed: ${excludedSet.size}`;
        lblRemainingCount.textContent = `Number remaining: ${remaining.length}`;
        out.textContent = JSON.stringify(remaining);
    }

    function parseAndProcess() {
        const raw = inputEl.value.trim();
        if (!raw) {
            const useEmpty = confirm('No JSON input detected. Use an empty claimed set?');
            if (!useEmpty) return;
            computeFromSet(new Set());
            return;
        }
        let obj;
        try {
            obj = JSON.parse(raw);
        } catch (e) {
            alert('JSON parse error: ' + e.message);
            return;
        }
        if (!obj || !Array.isArray(obj.claimed)) {
            alert('Invalid format: JSON must be like {"claimed":[...]}');
            return;
        }
        const claimed = new Set();
        for (const v of obj.claimed) {
            const n = Number(v);
            if (!Number.isInteger(n)) {
                alert('Invalid values: all items in "claimed" must be integers');
                return;
            }
            claimed.add(n);
        }
        computeFromSet(claimed);
    }

    btnProcess.addEventListener('click', parseAndProcess);
    btnEmpty.addEventListener('click', () => computeFromSet(new Set()));
    btnCopy.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(out.textContent);
            alert('Remaining numbers copied to clipboard.');
        } catch {
            alert('Copy failed. You can manually select and copy the output.');
        }
    });
    btnClose.addEventListener('click', () => panel.remove());

    inputEl.addEventListener('keydown', (ev) => {
        if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') {
            ev.preventDefault();
            parseAndProcess();
        }
    });

    computeFromSet(new Set());

    (function makeDraggable(el) {
        const header = el.querySelector('header');
        let dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;
        header.addEventListener('mousedown', (e) => {
            dragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = el.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            document.body.style.userSelect = 'none';
        });
        window.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.right = 'auto';
            el.style.bottom = 'auto';
            el.style.left = Math.max(6, startLeft + dx) + 'px';
            el.style.top = Math.max(6, startTop + dy) + 'px';
        });
        window.addEventListener('mouseup', () => {
            if (dragging) {
                dragging = false;
                document.body.style.userSelect = '';
            }
        });
    })(panel);

})();