/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from '../charadex.js';


/* ==================================================================== */
/* Load
======================================================================= */
document.addEventListener("DOMContentLoaded", async () => {
  let dex = await charadex.initialize.page(
    null, 
    charadex.page.faq, 
    (arr) => {

      let pageUrl = charadex.url.getPageUrl(charadex.page.faq.sitePage);
      for (let question of arr) {

        // Make the tags pretty and actually work <3
        question.tags = question.tags ? question.tags.split(',') : [];
        let fancyTagArr = [];
        if (question.tags.length >= 1) {
          for (let tag of question.tags) {
            fancyTagArr.push(`<a href="${charadex.url.addUrlParameters(pageUrl, {tags: tag.trim()})}">#${tag.trim()}</a>`);
          }
        }
        question.fancytags = fancyTagArr.join(' ');

      }
      
    }
  );
  charadex.tools.loadPage('.softload', 500);
});