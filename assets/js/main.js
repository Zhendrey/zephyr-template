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
const noRemove = document.querySelectorAll(".no-remove");


[...cards].forEach(destination => {
	intersectionObserver.observe(destination)
});

mission ? antiDisappearObserver.observe(mission) : ''
noRemove.forEach(el=>antiDisappearObserver.observe(el))

//BOOKING FORM
const getAirlinesData = async (method) =>{
	const data = await fetch(`./assets/json/${method}.json`)
	return await data.json();
}

//DOM ELEMENTS
const inputs = document.querySelectorAll(".form input");
const mainInputs = document.querySelectorAll(".form input.main-input");
const sideInputs = document.querySelectorAll(".form .category__input");
const directions = document.querySelectorAll(`label input[class*="direction"]`);
const [...rest] = directions;
const [from, to] = document.querySelectorAll(".form__direction");
const labels = [from, to];
const [...airportsList] = document.querySelectorAll(".airports__list");
const reversedBtn = document.querySelector(".reverse-button")
const formEl = document.querySelector("form.form");
const dataAboutForm = new FormData(formEl);
const directionInputs = [from.querySelector(`input[class*="direction"]`).value, to.querySelector(`input[class*="direction"]`).value]
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

//TRIP (Round/One Way)
const trip = document.querySelector("select#trip");
const [round, oneWay] = trip;

//timezone(City), iata, airport

function addAirportsList(event){
	const airportsEl = event.target.closest(`label[for="direction"]`).querySelector(".airports");
	const [...airportItem] = airportsEl.querySelectorAll(".airports__item");
	airportsEl.classList.add("active")
	airportItem.forEach(item=>item.classList.add("active"))
}
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
	
	const regExp = /\w{1,}/
	airportsEl.classList.toggle("active", regExp.test(value) && matchedAirport.length)

	airportItem.forEach((item, index)=>{
		if(!matchedAirport.includes(airportName[index].textContent)){
			item.classList.remove("active")
		}else{
			item.classList.add("active")
		}
	})
}

rest.forEach(input=>input.addEventListener("focus", addAirportsList))
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
	const formDirection = event.target.closest(".form__direction");
	const input = formDirection.querySelector("input");
	const airportText = event.target.closest(".item__button").querySelector(".item__body").querySelector(".item__abriviation").textContent;
	pasteSelectedAirport(targetElem.closest("label"), airportText);
	const selectedAirports = formDirection.querySelectorAll("button.selected-airport");
	if(selectedAirports.length > 1){
		deletePreviousAirport(selectedAirports);
	}
	input.value = airportText;
}

function pasteSelectedAirport(parent, airportName){
	parent.insertAdjacentHTML("afterbegin", 
		`
		<button class="selected-airport airports__selected-airport" type="button">
			<span class="selected-airport__name">${airportName}</span>
			<a href="#" class="selected-airport__remove icon icon-cross"></a>
		</button>
		`
	)
}
function deletePreviousAirport(airports){
	airports[airports.length-1].remove()
}

//REVERSE ORDER
function reverseOrder(){
	const [depart, dest] = document.querySelectorAll(".selected-airport");
	const fromValue = from.querySelector("input").value;
	const toValue = to.querySelector("input").value;
	from.querySelector("input").value = toValue;
	to.querySelector("input").value = fromValue;
	depart.textContent = toValue;
	dest.textContent = fromValue;
	console.log(from);
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

const datesObj = {
	"today": {
		year: year,
		month: month,
		day: '0' + day,
		date: `${year}-${month}-0${day}`,
		valid: true,
	},
	"tommorow": {
		year: year,
		month: month,
		day:  ++day,
		date: `${year}-${month}-0${day}`,
		day: ++day,
		date: `${year}-${month}-${day}`,
		valid: true,
	},
}


function isOneWay(){
	return oneWay.selected
}
isOneWay();

const removed = datesObj.tommorow;

trip.addEventListener("change", function(e){
	const oneWaySelected = isOneWay();
	if(oneWaySelected){
		returnDate.closest("label").style.display = 'none'
		datesObj.tommorow = ''
	}
	else {
		returnDate.closest("label").style.display = 'block'
		datesObj.tommorow = removed;
	}
})

const today = `${datesObj.today.date}`;
const tomorrow = `${datesObj.tommorow.date}`;

const initDepature = today;
const initReturn = tomorrow;

departureDate.value = initDepature;
returnDate.value = initReturn;

function changeInput(event){
	const value = event.target.value;
	const name = event.target.name;
	const year = value.slice(0,value.indexOf('-'))
	
		const month = value
		.replace(year,'')
		.slice(1,value.indexOf('-') - 1);
	
		const day = value
		.replace(year,'')
		.replace(month,'')
		.slice(2,value.indexOf('-'));
	
	datesObj[name].year = Number(year);
	datesObj[name].month = Number(month);
	datesObj[name].day = Number(day);
	datesObj[name].date = `${year}-${month}-${day}`
	checkInputs(event, datesObj, name);
}
function checkInputs(event, {today, tommorow}, name){
	const targetElem = event.target.closest(`input[name=${name}]`);
	const parentElem = event.target.closest(`label[for="dates"]`);
	const datesError = parentElem.querySelector(".dates__error");
	const dates = {today, tommorow}
	let isDayOk = today.month < tommorow.month ? true : today.day <= tommorow.day;
	let isMonthOk = dates['today'].month >= initMonth ? dates['today'].month <= dates['tommorow'].month : false;
	const isYearOk = year == dates[name].year;

	if(isOneWay()){
		console.log('one way trip');
		isMonthOk = today.month == initMonth;
	}
	dates[name].valid = isDayOk && isMonthOk && isYearOk;
	
	switch (true) {
		case !isDayOk || !isMonthOk:
			datesError.textContent = "Please, provide an appropriate date!"
			break;
		case !isMonthOk:
			datesError.textContent = `You cannot view flights from the past!`
			break;
		case !isYearOk:
			datesError.textContent = `You can only view flights of this year!`
			break;
	
		default:
			break;
	}
	targetElem.classList.toggle("invalid", !dates[name].valid)
}


dates.forEach(date=>date.addEventListener("input", changeInput))


//PASSANGER
const banner = document.querySelector("#banner");
const dropdown = document.querySelector(".dropdown");
const category = document.querySelectorAll(".category");
const passangerButton = document.querySelector(".passanger__button");
const decrease = document.querySelectorAll(".category__decrease");
const increase = document.querySelectorAll(".category__increase");
const categoryInput = document.querySelectorAll(".category__input");
const applyBtn = document.querySelector(".dropdown__apply");

category.forEach(category=>category.id = category.querySelector(".category__title").textContent.toLowerCase())

const passangerObj = {
	'adults': 1,
	'students': 0,
	'seniors': 0,
	'youths': 0,
	'children': 0,
	'toddlers': 0,
	'infants': 0,
	'class': 'economy',
	'bags': 0,
}
for (const key in passangerObj) {
	initPassanger(document.getElementById(`${key}`), passangerObj[key])
}
displayChoices();

function initPassanger(parentElem, changedCategory){
	const numberElem =  parentElem.querySelector(".category__input");
	numberElem.value = changedCategory;
	numberElem.checked = true;
}
function changeNum(event){
	const targetElem = event.target;
	const parentElem = targetElem.closest(`.category`);
	const categoryElem = parentElem.querySelector(".category__title");
	const category = categoryElem.textContent.toLowerCase();

	if(targetElem.classList.contains("category__increase") && typeof passangerObj[category] == 'number'){
		passangerObj[category]++
	}else if(targetElem.classList.contains("category__decrease") && typeof passangerObj[category] == 'number'){
		passangerObj[category] > 0 ? passangerObj[category]-- : 0
	}
	const totalPassangers = calcTotalPassangers(passangerObj);
	initPassanger(parentElem, passangerObj[category]);
}
function calcTotalPassangers(obj){
	const nums = [];
	for (const key in obj) {
		if(typeof obj[key] == 'number') nums.push(obj[key])
	}
	const total = nums.reduce((storage, currentValue)=>{
		return storage + currentValue
	}, 0)
	return total;
}
function displayChoices(){
	const totalPassangers = calcTotalPassangers(passangerObj);
	const passangerStr = totalPassangers == 1 ? `${totalPassangers} passanger` : `${totalPassangers} passangers`
	passangerButton.textContent = `${passangerStr}, ${passangerObj.class}, ${passangerObj.bags} bags`
}
function applyChoices(event){
	event.preventDefault();
	const checkedClass = [...document.querySelectorAll(`input[name="class"]`)].filter(input=>input.checked)
	passangerObj.class = checkedClass[0].value;
	displayChoices();
	dropdown.classList.remove("active")
}

applyBtn.addEventListener("click", applyChoices)

decrease.forEach(btn=>btn.addEventListener("click", changeNum))
increase.forEach(btn=>btn.addEventListener("click", changeNum))


window.addEventListener("click", (e)=>{
	const targetElem = e.target.closest('.passanger')
	if(e.target.classList.contains("dropdown__apply") || e.target.classList.contains('icon')){
		dropdown.classList.remove("active")
	}else{
		dropdown.classList.toggle("active", targetElem)
	}
}
)



//SEARCH FOR FLIGHTS (REDIRECT TO KAYAK.COM/FLIGHTS)

formEl.addEventListener("submit", searchAtKayak)
function searchAtKayak(e){
	e.preventDefault();
	const formData = new FormData(document.querySelector(".form"));
	const origin = formData.get("from");
	const destination = formData.get("to");
	const initDepature = datesObj.today.date;
	const returnDate = datesObj.tommorow.date || '';
	const {adults, seniors, youths, students, toddlers, children, infants, bags} = passangerObj;
	const underaged = [infants, toddlers, children, youths];
	const underagedTotal = underaged.reduce((storage, currentValue)=>{
		return storage + currentValue
	}, 0);
	const childrenStr = underagedTotal > 0 ? `children-${toddlers}S-${infants}L-${children}-${youths}` : ''
	const url = `
	https://www.kayak.com/flights/${origin}-${destination}/${initDepature}/${returnDate}/${adults}adults/${seniors}seniors/${students}students/${passangerObj.class}/${childrenStr}
	`
	window.location.href = url;
	console.log(datesObj);
	console.log(url);
}

//https://www.kayak.com/flights/JFK-SEA/2025-04-17/2025-04-18/${adults}adults/${senionrs}seniors/${students}students/children-${toddlers}S-${infants}L-${children}-${youth}?ucs=14ojkuq

/*
**PRIORITY LIST**
1. REFACTOR THE DATA INTO OBJECTS (1/2 done)
2. IMPROVE GENERAL FUNCTIONALITY AND VALUE CONTROL (1/2 done)
*/