
// -*- coding: utf-8 -*-
(function(){
  function ensureStyle(){
    var css = `
      .cmp-export-btn{position:fixed;right:16px;top:16px;z-index:9999;border:1px solid #2e3748;background:#0b1220;color:#e5e7eb;padding:10px 14px;border-radius:10px;cursor:pointer}
      @media print{.cmp-export-btn{display:none!important}}
      /* Masquer ce qu'on ne veut pas dans le PDF */
      .no-print{display:none !important;}
    `;
    var s=document.createElement('style'); s.textContent=css; document.head.appendChild(s);
  }
  function pick(sel){var el=document.querySelector(sel);return el?(el.value||el.textContent||"").trim():"";}
  async function exportPdf(){
    if (!window.jspdf||!window.html2canvas){ alert("PDF engine non chargé."); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p','mm','a4');
    const margins={left:10,right:10,top:10,bottom:10};
    // cover
    var logoEl=document.querySelector('img[src*="logo"], img[src*="bandeau"], img[src*="header"]');
    if (logoEl){
      try{
        const c=await html2canvas(logoEl,{scale:2,useCORS:true});
        doc.addImage(c.toDataURL('image/jpeg','1.0'),'JPEG',15,10,180,0);
      }catch(e){}
    }
    doc.setFontSize(18); doc.text("CMP — Rapport",15,70);
    // content
    const el=document.querySelector('#report, main, body');
    // Force-hide .no-print before render
    document.querySelectorAll('.no-print').forEach(n=> n.setAttribute('data-was-hidden','1'));
    const canvas=await html2canvas(el,{scale:2,useCORS:true,windowWidth:900});
    const pageW=doc.internal.pageSize.getWidth(), pageH=doc.internal.pageSize.getHeight();
    const imgW=pageW - (margins.left+margins.right);
    const pxPerMm=canvas.width/imgW;
    const usableH=pageH - (margins.top+margins.bottom);
    const sliceHpx=Math.ceil(usableH*pxPerMm);
    doc.addPage();
    let y=0, total=canvas.height;
    const slice=document.createElement('canvas'), ctx=slice.getContext('2d'); slice.width=canvas.width;
    let first=true;
    while(y<total){
      const h=Math.min(sliceHpx, total-y); slice.height=h; ctx.clearRect(0,0,slice.width,slice.height);
      ctx.drawImage(canvas,0,y,canvas.width,h,0,0,canvas.width,h);
      const imgData=slice.toDataURL('image/jpeg','1.0');
      if(!first) doc.addPage();
      doc.addImage(imgData,'JPEG',margins.left,margins.top,imgW,h/pxPerMm);
      y+=h; first=false;
    }
    // Restore .no-print
    document.querySelectorAll('[data-was-hidden]').forEach(n=> n.removeAttribute('data-was-hidden'));
    doc.save("CMP_rapport.pdf");
  }
  function mount(){
    ensureStyle();
    if (!document.getElementById('btn-export-pdf')){
      const b=document.createElement('button'); b.id='btn-export-pdf'; b.className='cmp-export-btn'; b.textContent='Exporter PDF';
      b.addEventListener('click', exportPdf);
      document.body.appendChild(b);
    }
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
