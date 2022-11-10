function filter(filter: object) : void {
	document.querySelectorAll(".card").forEach((item) => {
		item.classList.remove("hidden");
		for(const [k,v] of Object.entries(filter)) {
			const _TYPE = item.querySelector(`.card${k}`)
			const _TAGS = _TYPE.childNodes.length > 0 ? _TYPE.childNodes[_TYPE.childNodes.length-1].textContent.trim().split(",") : [_TYPE.textContent];
			for(let i=0;i<v.length;i++) {
				if(!_TAGS.includes(v[i])) {
					item.classList.add("hidden");
					break;
				}
			}
		}
	});
}

function client() : void {
	const _FILTER  = {}

	document.querySelectorAll(".menuContent > div > div > input").forEach((item) => {
		item.addEventListener("click", (data) => {
			const _TARGET  = (data.target as HTMLInputElement)
			const _TOP_ELE = _TARGET.parentElement.parentElement
			_FILTER[_TOP_ELE.classList[0].split("-")[1]] = Array.from(_TOP_ELE.querySelectorAll("input")).filter((item) => item.checked).map((item) => item.name)
			filter(_FILTER);
		});
	});
}

client();