//TODO: change the cancell logic. since new data could be matching but not 

var emp_list = new Array();

var icTO = null;
var changing = 0;

function inputChanged(e){
	if(icTO == null){
		// console.log("set timer");
		clearTimeout(icTO);
		icTO = window.setTimeout(function(){
			icTO = null;
			updateList(e);
		}, 200);
	}else{
		// console.log("about to update..");
	}
}

function updateList(e){
	var text = document.getElementById('company_name').getAttribute("name");

	updateInfo(text);

	if(isOption(text)){
		return;
	}

	if(changing == 1){
		inputChanged(e);
		return;
	}else{
		changing = 1;
	}

	$.ajax({
	    url: "/search",
	    data: {"q": text},
	    success: function(response) {
	    	if(response["employers"].length > 0){
				//console.log(response);
				//var compname = response["employers"][0]["name"];
				var emp_list = response["employers"];
				// console.log(resplist[0]["name"]);
				for (var index = 0; index < emp_list.length; index++){
					emp_set.add(emp_list[index]);
					var emp_name = emp_list[index]["name"];
					var emp_logo = emp_list[index]["squareLogo"];
					//console.log(emp_logo);
					if(!isOption(emp_name)){
						$('#company_list').append('<option value="' + emp_logo + '">' + emp_name + '</option>');
						//$('#company_list').append('<option id="'+ emp_logo +'">' + emp_logo + '</option>');
					}
				}
	    	}else{
	    		//console.log(response);
	    	}
	    	changing = 0;
	    	// console.log("changed");
	    },
	    error: function(xhr) {
	        //Do Something to handle error
	        changing = 0;
	    }
	});	
}

function updateInfo(text){
	var matchString = text.toLowerCase();
	
	for (comp of emp_set){
		var comp_name = comp["name"];
		var index = comp_name.toLowerCase().indexOf(matchString);
		if(index == 0 && comp_name.length == matchString.length){
			console.log(comp["squareLogo"]);
			document.getElementById('company_logo_img').src = comp["squareLogo"];
			document.getElementById('company_logo').value = comp["squareLogo"];
			document.getElementById('company_location').value = comp["featuredReview"]["location"];
			document.getElementById('company_website').value = comp["website"];
			document.getElementById('company_user_id').value = 1;
		}
	}
}


function isOption(text1){
	matchString = text1.toLowerCase();

	var found = false;
	$( "option" ).each(function( index ) {

		var index = $( this ).text().toLowerCase().indexOf(matchString);
		if(index == 0){
			// console.log( "yup:" + index + " " + $( this ).text().toLowerCase() + "," + matchString);
			found = true;
		}else{
			//console.log( "nope:" + index + " " + $( this ).text().toLowerCase() + " " + matchString);
		}
	});

	return found;
}



function addCompanies(companies){
	for (company of companies){
		console.log(company);
		emp_list[id] = company;
	}
}

for (var key in emp_list) {
    if (key === 'length' || !widthRange.hasOwnProperty(key)) continue;
    var value = widthRange[key];
}