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