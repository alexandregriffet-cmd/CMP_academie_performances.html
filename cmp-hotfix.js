/*! CMP Hotfix v1 — PDF résultats uniquement + logo centré (c) */
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  // Charge une librairie si absente
  function ensureLib(src, testFn){
    return new Promise(function(resolve){
      if (testFn()) return resolve();
      var s = document.createElement('script');
      s.src = src; s.onload = resolve; document.head.appendChild(s);
    });
  }

  // Détection de la carte "Résultats"
  function findResultsCard(){
    var hs = Array.from(document.querySelectorAll('h2'));
    var h = hs.find(function(x){ return (x.textContent||'').trim().toLowerCase() === 'résultats'; });
    if (h && h.closest('.card')) return h.closest('.card');
    var t = document.getElementById('scoreTable');
    if (t && t.closest('.card')) return t.closest('.card');
    // en dernier recours, on prend la 1re carte visible après un h2 contenant "Résult"
    var h2 = hs.find(function(x){ return /résult/i.test((x.textContent||'')); });
    if (h2 && h2.closest('.card')) return h2.closest('.card');
    return document.body;
  }

  // Centrage du logo (bandeau)
  async function getCenteredLogoInfo(pageW, margins){
    var logoEl = document.querySelector('.bandeau img, img[src*="logo"], img[src*="bandeau"], img[src*="header"]');
    if (!logoEl) return null;
    try{
      var c = await html2canvas(logoEl, {scale:2, useCORS:true});
      var imgData = c.toDataURL('image/png');
      var ratio = c.height / c.width;
      var wmm = Math.min(pageW - (margins.l + margins.r), 180);
      var hmm = wmm * ratio;
      if (hmm > 50){ hmm = 50; wmm = hmm / ratio; }
      var x = (pageW - wmm)/2;
      return {imgData, wmm, hmm, x};
    }catch(e){ return null; }
  }

  // Supprime boutons CSV/JSON, masque "Détail par item", garantit bouton PDF
  function cleanupUI(){
    // masquer "Détail par item" par id, classe ou titre
    var detail = document.getElementById('detail-par-item');
    if (!detail){
      // tentative via titre
      var heads = Array.from(document.querySelectorAll('h3,h2,h4'));
      var h = heads.find(function(x){ return /d[ée]tail\s+par\s+item/i.test((x.textContent||'')); });
      if (h) detail = h.closest('.scores') || h.parentElement;
    }
    if (detail){
      detail.classList.add('no-print');
      detail.style.display = 'none';
    }

    // retirer boutons CSV/JSON par id et par texte
    var killById = ['exportCsv','exportJSON','exportJson'];
    killById.forEach(function(id){ var el = document.getElementById(id); if(el) el.remove(); });
    Array.from(document.querySelectorAll('button')).forEach(function(b){
      var t=(b.textContent||'').trim().toLowerCase();
      if (t==='exporter csv' || t==='exporter json') b.remove();
    });

    // garantir le bouton PDF
    if (!document.getElementById('exportPdf')){
      var resetBtn = document.getElementById('reset') || document.querySelector('button.btn');
      var pdf = document.createElement('button');
      pdf.id='exportPdf'; pdf.className=resetBtn?resetBtn.className:'btn';
      pdf.textContent='Exporter PDF';
      if (resetBtn && resetBtn.parentElement) resetBtn.parentElement.appendChild(pdf);
      else document.body.insertBefore(pdf, document.body.firstChild);
    }
  }

  ready(async function(){
    cleanupUI();

    // S'assurer des libs
    await ensureLib('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', function(){ return !!window.html2canvas; });
    await ensureLib('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', function(){ return !!(window.jspdf && window.jspdf.jsPDF); });

    var btn = document.getElementById('exportPdf');
    if (!btn) return;

    btn.addEventListener('click', async function(){
      var jsPDF = window.jspdf.jsPDF;
      var doc = new jsPDF('p','mm','a4');
      var pageW = doc.internal.pageSize.getWidth();
      var pageH = doc.internal.pageSize.getHeight();
      var margins = {l:10, r:10, t:10, b:10};

      var target = findResultsCard();

      // capture résultats (exclut .no-print)
      var resultsCanvas = await html2canvas(target, {
        scale: 2, useCORS: true,
        ignoreElements: el => el.classList && el.classList.contains('no-print')
      });

      // logo centré
      var header = await getCenteredLogoInfo(pageW, margins);
      var yCursor = margins.t;
      if (header){
        doc.addImage(header.imgData, 'PNG', header.x, yCursor, header.wmm, header.hmm);
        yCursor += header.hmm + 6;
      }

      // pagination
      var imgW = pageW - (margins.l + margins.r);
      var pxPerMm = resultsCanvas.width / imgW;
      var usableH = pageH - yCursor - margins.b;
      var sliceHpx = Math.ceil(usableH * pxPerMm);

      var y = 0, first = true;
      var slice = document.createElement('canvas');
      var ctx = slice.getContext('2d');
      slice.width = resultsCanvas.width;

      while (y < resultsCanvas.height){
        var h = Math.min(sliceHpx, resultsCanvas.height - y);
        slice.height = h;
        ctx.clearRect(0,0,slice.width,slice.height);
        ctx.drawImage(resultsCanvas, 0, y, resultsCanvas.width, h, 0, 0, slice.width, h);
        var part = slice.toDataURL('image/png');

        if (!first){ doc.addPage(); yCursor = margins.t; }
        doc.addImage(part, 'PNG', margins.l, yCursor, imgW, h/pxPerMm);
        first = false;
        y += h;
      }

      doc.save('CMP_resultats.pdf');
    });
  });
})();