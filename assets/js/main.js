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


//PARIS (PARIJE)

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
}, {threshold: 0.2})

reasons.forEach(reason=>intersectionObserver.observe(reason))


const antiDisappearObserver = new IntersectionObserver((entries)=>{
	entries.forEach(entry=>{
		if(entry.isIntersecting){
			entry.target.classList.add("active")
		}
	})
}, {threshold: 0.2}) 

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

antiDisappearObserver.observe(mission);


//GITHUB CODE
var airlinesData = function(timeToLoad) {
	this.busyTime = timeToLoad || 1000;
};
console.log(airlinesData())

airlinesData.prototype = function() {
	var ffInfo = {
		firstName: 'Jaxon', lastName: 'Daniels', ffNum: '12345678', status: 'Diamond', miles: 55555,
    
		flights: [
			{
				id: 1111, 
				cNum: 'ABCDED',
				timeToCheckIn:true,
				currentSegment:0,
				segments: [
					{ from: 'SEA', to: 'BOS', departDate: '6/1/2012', time: '5:00PM', flightNum: '111', seat: '5A', gate: 'C10' },
					{ from: 'BOS', to: 'SEA', departDate: '6/11/2012', time: '4:00PM', flightNum: '122', seat: '5D', gate: 'A1' }
				]
			},
			{
				id: 1112, 
				cNum: 'DSLEMS', 
				timeToCheckIn: false,
				currentSegment:0,
				segments: [
					{ from: 'SEA', to: 'SAN', departDate: '6/13/2012', time: '5:00PM', flightNum: '113', seat: '5A', gate: 'D10' },
					{ from: 'SAN', to: 'SEA', departDate: '6/17/2012', time: '4:00PM', flightNum: '124', seat: '5D', gate: 'B1' }
				]
			}
		]
	},
    
	getDataforFF = function(id, callback) {
		fauxAjax(function () {
			callback(ffInfo);
		}, 'getting your data ...', this);
	},
    
	logOn = function (uid, pwd, callback) {
		fauxAjax(function () {
			callback('12345678', true);
		}, 'logging you in ...', this);
	},
    
	fauxAjax = function fauxAjax(func, text, thisObj) {
		$.mobile.loading('show', { theme: 'a', textVisible: true, text:text });
		window.setTimeout(function () {
			$.mobile.loading('hide');
			func();
           
		}, thisObj.busyTime);
	};
    
	return{
		logOn:logOn,
		getDataforFF:getDataforFF
	}
}();