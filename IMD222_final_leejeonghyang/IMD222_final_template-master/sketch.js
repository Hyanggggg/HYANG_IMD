function trail(e) {
  var div = document.createElement("div");

  div.classList.add("mouseTrail");

  Object.assign(div.style, {
    top: e.pageY + "px",
    left: e.pageX + "px",
  });

  document.body.appendChild(div);
  setTimeout(function () {
    document.body.removeChild(div);
  }, 900);
}

addEventListener("mousemove", trail);
