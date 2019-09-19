const fireNotify = message => {
    const notify = document.getElementById("notify");
    const msg = document.getElementById("notify");

    if (notify.classList.contains("show")) {
        console.log("EXIST EXIST NOTIFY");
        notify.classList.remove("show");
        notify.style.webkitAnimation = 'none';
        setTimeout(function() {
            notify.style.webkitAnimation = '';
        }, 10);
    }

    msg.innerText = message;
    notify.className = "show";
    notify.addEventListener("animationend", () => notify.classList.remove("show"));        // Standard syntax
};