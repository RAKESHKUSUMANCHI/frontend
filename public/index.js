

  html2canvas(document.querySelector("#full-image")).then(function(canvas) {

    let a=document.querySelector(".download");
    a.href=canvas.toDataURL();
    a.download="meme_img.png";
  });
