/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from '../charadex.js';


/* ==================================================================== */
/* Load
======================================================================= */
document.addEventListener("DOMContentLoaded", async () => {
  let dex = await charadex.initialize.page(null, charadex.page.staff, (arr) => {
    return arr.filter(a => a.mod);
  });
  charadex.tools.loadPage('.softload', 500);
});