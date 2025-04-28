/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from '../charadex.js';


/* ==================================================================== */
/* Load
======================================================================= */
document.addEventListener("DOMContentLoaded", async () => {
  let dex = await charadex.initialize.page(null, charadex.page.prompts, null, (data) => {
    $('.cd-prompt-background').each(function(i) {
      const element = $(this);
      const image = data.array[i]?.image;
      element.attr('style', `background-image: url(${image})`);
    });
  });
  charadex.tools.loadPage('.softload', 500);
});