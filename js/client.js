function client() {
    var _FILTER = [];
    document.querySelectorAll(".filterContentArch > div > input").forEach(function (item) {
        item.addEventListener("click", function (data) {
            var _TARGET = data.target;
            if (_TARGET.checked) {
                _FILTER.push(_TARGET.name);
            }
            else {
                _FILTER.splice(_FILTER.indexOf(_TARGET.name), 1);
            }
            document.querySelectorAll(".card").forEach(function (item) {
                var _CURARCHETYPES = item.querySelector(".cardArchetypes").innerHTML;
                if (item.style.display != "none") {
                    if (_FILTER.length != 0 && _CURARCHETYPES.indexOf(_FILTER[_FILTER.length - 1]) == -1) {
                        item.style.display = "none";
                    }
                }
                else {
                    if (_FILTER.length != 0 && _CURARCHETYPES.indexOf(_FILTER.join(",")) > 0) {
                        item.style.display = "";
                    }
                    else if (_FILTER.length == 0) {
                        item.style.display = "";
                    }
                }
            });
        });
    });
}
client();
