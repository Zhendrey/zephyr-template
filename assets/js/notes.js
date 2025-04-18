console.log(matchedAirport);
	
	matchedAirport.forEach(({departure}, index)=>{
		if(departure.airport.includes(value)
			&& matchedAirport.includes(data[index].departure.airport)){
			manageItem("create", airportsList, departure.airport, "airports__item")
		}else{
			// airportItem[index].remove()
		}
	})
	// matchedAirport.forEach(airport=>{
	// 	airportsList.append(airport)
	// })
	// console.log(matchedAirport);

	function changeInput(e,obj){
		const value = e.target.value;
		const name = e.target.name;
	
		const year = value.slice(0,value.indexOf('-'))
	
		const month = value
		.replace(year,'')
		.slice(1,value.indexOf('-') - 1);
	
		const day = value
		.replace(year,'')
		.replace(month,'')
		.slice(2,value.indexOf('-'));
	
		obj[name].year = Number(year);
		obj[name].month = Number(month);
		obj[name].day = Number(day);
		console.log(obj[name]);
	
		const isYearOk = new Date().getFullYear() == Number(year) ? true : false;
		const isMonthOk = new Date().getMonth() >= Number(month) ? obj["today"].month <= obj["tommorow"].month : false;
		const areDaysEqual = obj["today"].month == obj["tommorow"].month ?  obj["today"].day <= obj["tommorow"].day : true;
	
		obj[name].valid = isYearOk && isMonthOk && areDaysEqual;
		console.log(obj[name].valid);
		
		return true;
	}
	function checkInputs(e){
		const isDateValid = changeInput(e,datesObj);
		if(!isDateValid) {
			dates.forEach(date=>date.classList.add("invalid"));
		}else{
			dates.forEach(date=>date.classList.remove("invalid"));
		}
	}

dates.forEach(date=>date.addEventListener("input", checkInputs));

decrease.forEach((btn, index)=>btn.addEventListener("click", (e)=>{
	categoryInput[index].value > 0 ?  Number(categoryInput[index].value--) : categoryInput[index].value
}))
increase.forEach((btn, index)=>btn.addEventListener("click", (e)=>{
	Number(categoryInput[index].value++)
}))