# Tampermonkey — Claimed / Remaining Numbers

Install:
1. Open Tampermonkey in your browser.
2. Create a new script and paste the contents of `src/tampermonkey_claimed_remaining.user.js`.
3. Save and enable the script.

Usage:
- Paste JSON like: `{"claimed":[19,39,99,...]}`
- Click "Process" to see `Number claimed`, `Number remaining`, and the sorted remaining list.
- Use "Use empty claimed set" to treat claimed as empty.

Adjust the `@match` header in the userscript if you want it limited to specific sites.