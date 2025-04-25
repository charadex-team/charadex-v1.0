/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from '../charadex.js';


/* ==================================================================== */
/* Load
======================================================================= */
document.addEventListener("DOMContentLoaded", async () => {

  // Load the nav/footer/ect
  charadex.tools.loadIncludedFiles();
  charadex.tools.loadPage('#charadex-body', 100);

});