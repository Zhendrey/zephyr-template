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
const labels = [from, to];
const [...airportsList] = document.querySelectorAll(".airports__list");
const reversedBtn = document.querySelector(".reverse-button")
const formEl = document.querySelector("form.form");
const dataAboutForm = new FormData(formEl);
const mutationObserver = new MutationObserver((mutations)=>{
	mutations.forEach(mutation=>{
		if(mutation.type == 'childList'){
			const selectAirport = mutation.target.querySelectorAll(".selected-airport");
			const airports = mutation.target.querySelector(".airports");
			selectAirport.length ? airports.classList.remove("active") : ''
		}
		}
	)
})


labels.forEach(label=>{mutationObserver.observe(label, {childList: true})})

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
			const {timezone, iata, airport} = departure;
			manageItem("create", airportsList[i], [timezone, iata, airport], 'airports__item')
		}
		i++;
	}
})()


//timezone(City), iata, airport
async function findDepartureAirport(event){
	const airportData = await getAirlinesData('airports');
	const data = airportData[0].data;
	const value = event.target.value.toLowerCase();
	const airportsEl = event.target.closest(`label[for="direction"]`).querySelector(".airports");
	const [...airportItem] = airportsEl.querySelectorAll(".airports__item");
	const [...airportName] = airportsEl.querySelectorAll(".item__airport-name");
	
	const matchedAirport = data.filter(({departure})=>{
		const {timezone, iata, airport} = departure;
		const obj = {timezone, iata, airport};
		const isSatisfied = [];
		for (const key in obj) {
			if(!obj[key].toLowerCase().includes(value)) isSatisfied.push(false);
			else isSatisfied.push(true);
		}
		return isSatisfied.some(condition=>condition)
	}).map(({departure})=>departure.airport)
	
	airportsEl.classList.toggle("active", value !== ' ' && value !== '' && matchedAirport.length)

	airportItem.forEach((item, index)=>{
		if(!matchedAirport.includes(airportName[index].textContent)){
			item.classList.remove("active")
		}else{
			item.classList.add("active")
		}
	})
}
rest.forEach(input=>input.addEventListener("input", findDepartureAirport))


function manageItem(action, parent, content,  className, el){
	const [timezone, iata, airport] = content;
	let slash = timezone.indexOf('/');
	let underScore = timezone.indexOf("_");
	const roughContinent = timezone.slice(0,slash);
	const continent = roughContinent.slice(0,roughContinent.length);
	const city = timezone.slice(continent.length, timezone.length).replace('_', ' ');
	
	if(action == 'create'){
		const item = document.createElement("li");
		const planeIcon_SVG = `<svg viewBox="0 0 200 200" width="20" height="20" xmlns="http://www.w3.org/2000/svg" role="presentation"><path d="M178.081 41.973c-2.681 2.663-16.065 17.416-28.956 30.221c0 107.916 3.558 99.815-14.555 117.807l-14.358-60.402l-14.67-14.572c-38.873 38.606-33.015 8.711-33.015 45.669c.037 8.071-3.373 13.38-8.263 18.237L50.66 148.39l-30.751-13.513c10.094-10.017 15.609-8.207 39.488-8.207c8.127-16.666 18.173-23.81 26.033-31.62L70.79 80.509L10 66.269c17.153-17.039 6.638-13.895 118.396-13.895c12.96-12.873 26.882-27.703 29.574-30.377c7.745-7.692 28.017-14.357 31.205-11.191c3.187 3.166-3.349 23.474-11.094 31.167zm-13.674 42.469l-8.099 8.027v23.58c17.508-17.55 21.963-17.767 8.099-31.607zm-48.125-47.923c-13.678-13.652-12.642-10.828-32.152 8.57h23.625l8.527-8.57z"></path></svg>`
		item.classList.add('item')
		item.classList.add(className)
		parent.appendChild(item);
		item.insertAdjacentHTML("beforeend", 
			`
			<button type="button" class="item__button"">
				<div class="item__body">
					<div class="item__plane-icon">
						${planeIcon_SVG}
					</div>
					<div class="item__info">
					<h4 class="item__title">${city.slice(1,city.length)}, ${continent}</h4>
					<span class="item__abriviation">${iata}</span>
					<p class="item__airport-name">${airport}</p>
					</div>
				</div>
			</button>
			`
		)
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

	parent.prepend(selectedAirport);
	// selectedAirport.insertAdjacentHTML("beforeend", 
	// 	`

	// 	`
	// )
}

//REVERSE ORDER
function reverseOrder(){
	from.classList.toggle("reversed");
	to.classList.toggle("reversed");
	from.querySelector('input').placeholder = from.classList.contains("reversed") ? 'To?' : 'From?'
	to.querySelector('input').placeholder = to.classList.contains("reversed") ? 'From?' : 'To?'
}

reversedBtn.addEventListener("click", reverseOrder)


//DATES

//DOM NODES
const dates = document.querySelectorAll(`.dates input[type="date"]`);
const [departureDate, returnDate] = dates;

//VARIABLES
let day = new Date().getDate();
let initMonth = new Date().getMonth();
const month = '0' + ++initMonth;
const year = new Date().getFullYear();

const today = `${year}-${month}-${day}`;
const tomorrow = `${year}-${month}-${++day}`;

const initDepature = today;
const initReturn = tomorrow;

departureDate.value = initDepature;
returnDate.value = initReturn;

//PASSANGER
const banner = document.querySelector("#banner");
const dropdown = document.querySelector(".dropdown");
const passangerButton = document.querySelector(".passanger__button");

const isClicked = new MutationObserver((mutations)=>{
	mutations.forEach(mutation=>console.log(mutation.target))
})

isClicked.observe(dropdown, {subtree: true, childList: true})

banner.addEventListener("click", (e)=>{
	if(!e.target.classList.contains("passanger__button")) dropdown.classList.remove("active")
	else dropdown.classList.toggle("active");
}
)