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

  // Change the document meta
  document.title = document.title.replace('Charadex', charadex.site.title);
  document.querySelector('meta[name="title"]').setAttribute("content", document.title);
  document.querySelector('meta[name="url"]').setAttribute("content", charadex.site.url);
  document.querySelector('meta[name="description"]').setAttribute("content", charadex.site.description);

  charadex.tools.loadPage('#charadex-body', 100);

});