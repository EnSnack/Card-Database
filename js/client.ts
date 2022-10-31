function filter(type: string, filter: Array<string>) : void {
	document.querySelectorAll(".card").forEach((item) => {
		const _CURTYPES = item.querySelector(`.card${type}`).innerHTML
		if((<any>item).style.display != "none") {
			if(filter.length != 0 && _CURTYPES.indexOf(filter[filter.length-1]) == -1) {
				(<any>item).style.display = "none";
			}
		} else {
			if(filter.length != 0 && _CURTYPES.indexOf(filter.join(",")) > -1) {
				(<any>item).style.display = "";
			} else if(filter.length == 0) {
				(<any>item).style.display = "";
			}
		}
	});
}

function client() : void {
	document.querySelectorAll(".menuContent > div > div > input").forEach((item) => {
		item.addEventListener("click", (data) => {
			const _TARGET = (data.target as HTMLInputElement)
			filter(_TARGET.parentElement.parentElement.classList[0].split("-")[1],Array.from(_TARGET.parentElement.parentElement.querySelectorAll("input")).filter((item) => item.checked).map((item) => item.name));
		});
	});
}

client();