function filter(type, filter) {
    document.querySelectorAll(".card").forEach(function (item) {
        var _CURTYPES = item.querySelector(".card".concat(type)).innerHTML;
        if (item.style.display != "none") {
            if (filter.length != 0 && _CURTYPES.indexOf(filter[filter.length - 1]) == -1) {
                item.style.display = "none";
            }
        }
        else {
            if (filter.length != 0 && _CURTYPES.indexOf(filter.join(",")) > -1) {
                item.style.display = "";
            }
            else if (filter.length == 0) {
                item.style.display = "";
            }
        }
    });
}
function client() {
    document.querySelectorAll(".menuContent > div > div > input").forEach(function (item) {
        item.addEventListener("click", function (data) {
            var _TARGET = data.target;
            filter(_TARGET.parentElement.parentElement.classList[0].split("-")[1], Array.from(_TARGET.parentElement.parentElement.querySelectorAll("input")).filter(function (item) { return item.checked; }).map(function (item) { return item.name; }));
        });
    });
}
client();
