function client() : void {
	const _FILTER: Array<string> = [];

	document.querySelectorAll(".filterContentArch > div > input").forEach((item) => {
		item.addEventListener("click", (data) => {
			const _TARGET = (data.target as HTMLInputElement)
			if(_TARGET.checked) {
				_FILTER.push(_TARGET.name)
			} else {
				_FILTER.splice(_FILTER.indexOf(_TARGET.name), 1);
			}
			
			
			document.querySelectorAll(".card").forEach((item) => {
				const _CURARCHETYPES = item.querySelector(".cardArchetypes").innerHTML
				if((<any>item).style.display != "none") {
					if(_FILTER.length != 0 && _CURARCHETYPES.indexOf(_FILTER[_FILTER.length-1]) == -1) {
						(<any>item).style.display = "none";
					}
				} else {
					if(_FILTER.length != 0 && _CURARCHETYPES.indexOf(_FILTER.join(",")) > 0) {
						(<any>item).style.display = "";
					} else if(_FILTER.length == 0) {
						(<any>item).style.display = "";
					}
				}
			});
		});
	});
}

client();