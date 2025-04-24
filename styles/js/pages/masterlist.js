/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from '../charadex.js';


/* ==================================================================== */
/* Load
======================================================================= */
document.addEventListener("DOMContentLoaded", async () => {

  let dex = charadex.initialize(
    null,
    charadex.page.masterlist,
  );

  
  $('#loading').hide();
  $('.softload').addClass('active');
  
});