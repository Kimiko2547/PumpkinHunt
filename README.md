# Tampermonkey — Claimed / Remaining Numbers

Install:

Method A: via GitHub
1. Click on `tampermonkey_claimed_remaining.user.js`.
1. Click the `Raw` button on the top right.
2. Click install/reinstall button in Tampermonkey popup.

Method B: via manual copy-paste
1. Open Tampermonkey in your browser.
2. Create a new script and paste the contents of `src/tampermonkey_claimed_remaining.user.js`.
3. Save and enable the script.

Usage:
- Open `https://backend.wplace.live/event/hallowen/pumpkins/claimed`.
- Highlight and copy the text i.e. `{"claimed":[19,39,99,...]}`.
- Paste it into the Process box.
- Click "Process" to see `Number claimed`, `Number remaining`, and the sorted remaining list.
- Use "Use empty claimed set" to treat claimed as empty.

Adjust the `@match` header in the userscript if you want it limited to specific sites.