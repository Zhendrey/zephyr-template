/*
	Zephyr Airlines
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/


(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ null,      '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Dropdowns.
		$('#nav > ul').dropotron({
			mode: 'fade',
			noOpenerFade: true,
			speed: 300
		});

	// Nav.

		// Toggle.
			$(
				'<div id="navToggle">' +
					'<a href="#navPanel" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

})(jQuery);


// PARIS (PARIJE)

const reasons = document.querySelectorAll(".reasons__link");
const titles = document.querySelectorAll(".paris .reasons__link h3");
const paragraphs = document.querySelectorAll(".paris .reasons__list p");
const images = document.querySelectorAll(".paris .reasons__list img");
const intersectionObserver = new IntersectionObserver((entries)=>{
	entries.forEach(entry=>{
		if(!entry.isIntersecting){
			entry.target.classList.remove("active")
		}else{
			entry.target.classList.add("active")
		}
	})
}, {threshold: 0.15, rootMargin: '100px'})

reasons.forEach(reason=>intersectionObserver.observe(reason))


const antiDisappearObserver = new IntersectionObserver((entries)=>{
	entries.forEach(entry=>{
		if(entry.isIntersecting){
			entry.target.classList.add("active")
		}
	})
}, {threshold: 0.15}) 

const getData = async () => {
	const response = await fetch('../assets/json/reasons.json');
	const data = await response.json();
	return data;
}

(async () => {
	const data = await getData();
titles.forEach((title, index)=>{
	title.textContent = `${index + 1}. ${data[0].reasons[index].name}`
})
Array.from(paragraphs).forEach((paragraph, index)=>{
	paragraph.textContent = data[0].reasons[index].description
})
Array.from(images).forEach((image, index)=>{
	image.src = data[0].reasons[index].image
	image.alt = data[0].reasons[index].name;
})
})();


//INDEX (HOME PAGE)

const cards = document.querySelectorAll(".card");
const mission = document.querySelector(".mission");
const pageWrapper = document.getElementById("page-wrapper");


[...cards].forEach(destination => {
	intersectionObserver.observe(destination)
});

mission ? antiDisappearObserver.observe(mission) : ''


//BOOKING FORM
const getAirlinesData = async (method) =>{
	const data = await fetch(`./assets/json/${method}.json`)
	return await data.json();
}

//DOM ELEMENTS
const directions = document.querySelectorAll(`label input[class*="direction"]`);
const [...rest] = directions;
const [from, to] = document.querySelectorAll(".form__direction");
const [...airportsList] = document.querySelectorAll(".airports__list");
const reversedBtn = document.querySelector(".reverse-button")

function isValue(){
	return document.querySelectorAll(".airports__item").some(item=>item.length)
}
(async()=>{
	const data = await getAirlinesData('airports');
	console.log(data[0].data);
	
	let i = 0;
	while(i < airportsList.length){
		for (let ii = 0; ii < data[0].data.length; ii++) {
			const {departure} = data[0].data[ii];
			manageItem("create", airportsList[i], departure.airport, 'airports__item')
		}
		i++;
	}
})()


async function findDepartureAirport(event){
	const airportData = await getAirlinesData('airports');
	const data = airportData[0].data;
	const value = event.target.value.toLowerCase();
	const directionLabel = event.target.closest(`label[for="direction"]`).querySelector(".airports");
	const airportItem = directionLabel.querySelectorAll("li.airports__item");
	
	const matchedAirport = data.filter(({departure})=>{
		return departure.airport.toLowerCase().includes(value);
	}).map(({departure})=>departure.airport)
	directionLabel.classList.toggle("active", value !== ' ' && value !== '' && matchedAirport.length)
	

	for (const item of airportItem) {
		if(!matchedAirport.includes(item.textContent)){
			item.classList.remove("active")
		}else{
			item.classList.add("active")
		}
	}
}
rest.forEach(input=>input.addEventListener("input", findDepartureAirport))


function manageItem(action, parent, text,  className, el){
	if(action == 'create'){
		const item = document.createElement("li");
		const button = document.createElement("button");
		item.classList.add(className)
		item.classList.add("active")
		item.append(button);
		button.textContent = text;
		button.type = 'button';
		parent.appendChild(item);
	}else if(action == 'remove'){
		el.remove()
	}
}

airportsList.forEach(item=>item.addEventListener("click", selectAirport))

async function selectAirport(event){
	const formEl = event.target.closest("form");
	const targetElem = event.target.closest(".airports__item button");
	pasteSelectedAirport(targetElem.closest("label"), targetElem.textContent);
	formEl.reset();
}

function pasteSelectedAirport(parent, airportName){
	const selectedAirport = document.createElement("button");
	const selectedAirport_NAME = document.createElement("span");
	const selectedAirport_REMOVE = document.createElement("a");
	const removeImage = document.createElement("img");
	selectedAirport.classList.add("selected-airport");
	selectedAirport.type = 'button'
	selectedAirport.classList.add("airports__selected-airport");
	selectedAirport_NAME.classList.add("selected-airport__name");
	selectedAirport_NAME.textContent = airportName;
	selectedAirport_REMOVE.href = '#';
	selectedAirport_REMOVE.classList.add("selected-airport__remove");
	selectedAirport_REMOVE.classList.add("icon");
	selectedAirport_REMOVE.classList.add("icon-cross");
	parent.prepend(selectedAirport);
	selectedAirport.append(selectedAirport_NAME);
	selectedAirport.append(selectedAirport_REMOVE);
}

//REVERSE ORDER
function reverseOrder(){
	from.classList.toggle("reversed");
	to.classList.toggle("reversed");
	from.querySelector('input').placeholder = from.classList.contains("reversed") ? 'To?' : 'From?'
	to.querySelector('input').placeholder = to.classList.contains("reversed") ? 'From?' : 'To?'
}

reversedBtn.addEventListener("click", reverseOrder)
