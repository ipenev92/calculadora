// Variables
let sign, button, multi, single, outputCurr, last, first_number, radio, deletion;
let buttons         = document.getElementsByClassName("button");
let multis          = document.getElementsByClassName("multi");
let singles         = document.getElementsByClassName("single");
let deletions       = document.getElementsByClassName("deletion");
let radios          = document.getElementsByTagName("input");
let operation_signs = ["+", "-", "*", "/", "%", "^", "M"];

window.onload = function() {
	document.getElementById("standard").style.display = "none";
	//document.getElementById("date").style.display = "none";

	outputCurr = document.getElementById("output_current");
	outputAll = document.getElementById("output_all");

	for (let i=0; i<buttons.length; i++) {
		button = buttons[i];
        button.onclick = function() {
        	if (operation_signs.includes(last)) {
        		first_number = outputCurr.innerHTML;
        		outputCurr.innerHTML = "";
        		last = "";
        	}
        	outputCurr.innerHTML += this.value;
        }
    }

	for (let i=0; i<multis.length; i++) {
		multi = multis[i];
        multi.onclick = function() {
        	sign = obtainOperation(this.value);
        	outputAll.innerHTML = outputCurr.innerHTML + sign;
        	last = outputAll.innerHTML.slice(-1);
        }
    }

    for (let i=0; i<singles.length; i++) {
    	single = singles[i];
    	single.onclick = function() {
    		outputCurr.innerHTML = executeSingle(this.value, outputCurr.innerHTML, outputAll.innerHTML);
    	}
    }

    for (let i=0; i<deletions.length; i++) {
    	deletion = deletions[i];
    	deletion.onclick = function() {
    		switch (this.value) {
				case "deleteCurrent": return deleteCurrent(outputCurr);
				case "deleteAll":     return deleteAll(outputCurr, outputAll);
				case "deleteLast":    return deleteLast(outputCurr);
			}
    	}
    }

    for (let i = 0; i < radios.length; i++) {
	    radio = radios[i];
	    radio.onchange = function() {
	    	changeCalculator(this.value);
	    }
    }

    document.getElementById("equal").onclick = function() {
    	outputAll.innerHTML = "";
    	outputCurr.innerHTML = equal(first_number, outputCurr.innerHTML, sign);
    }
    document.getElementById("equal_sc").onclick = function() {
    	outputAll.innerHTML = "";
    	outputCurr.innerHTML = equal(first_number, outputCurr.innerHTML, sign);
    }
    document.getElementById("pi").onclick = function() {
    	first_number = outputCurr.innerHTML;
    	outputCurr.innerHTML = 3.1415;
    }
}

function obtainOperation(value) {
	last = outputCurr.innerHTML.substr(-1);
	if (!operation_signs.includes(last)) {
		switch (value) {
			case "sum":      return "+";
			case "subtract": return "-";
			case "multiply": return "*";
			case "divide":   return "/";
			case "percent":  return "%";
			case "expY":     return "^";
			case "module":   return "M";
		}
	} else {
		outputCurr.innerHTML = outputCurr.innerHTML.slice(0, -1);
		switch (value) {
			case "sum":      return "+";
			case "subtract": return "-";
			case "multiply": return "*";
			case "divide":   return "/";
			case "percent":  return "%";
			case "expY":     return "^";
			case "module":   return "M";
		}
	}
}

function executeSingle(operation, valueCurr, valueAll) {
	switch (operation) {
		case "squareRoot":    return Math.sqrt(valueCurr);
		case "exp2":          return valueCurr * valueCurr;
		case "divideOne":     return 1 / valueCurr;
		case "posNeg":        return -valueCurr;
		case "tenX":          return Math.pow(10, valueCurr);
		case "factorial":     return factorial(valueCurr);
		case "sin":           return Math.sin(toDegrees(valueCurr));
		case "cos":           return Math.cos(toDegrees(valueCurr));
		case "tan":           return Math.tan(toDegrees(valueCurr));
		case "deleteCurrent": case "deleteAll": case "deleteLast":
			return executeDeletion(operation, valueCurr, valueAll);
	}
}

function changeCalculator(value) {
	switch (value) {
		case "standard":
			document.getElementById("standard").style.display = "block";
			document.getElementById("scientific").style.display = "none";
			//document.getElementById("date").style.display = "none";
			break;
		case "scientific":
			document.getElementById("standard").style.display = "none";
			document.getElementById("scientific").style.display = "block";
			//document.getElementById("date").style.display = "none";
			break;
		case "standard":
			document.getElementById("standard").style.display = "none";
			document.getElementById("scientific").style.display = "none";
			//document.getElementById("date").style.display = "block";
			break;
	}
}

function deleteCurrent(value) {
	value.innerHTML = "";
}

function deleteAll(value_curr, value_all) {
	value_curr.innerHTML = "";
	value_all.innerHTML = "";
}

function deleteLast(value) {
	value.innerHTML = value.innerHTML.slice(0, -1);
}

function equal(first, second, sign) {
	console.log(first, second, sign);
	switch (sign) {
		case "+":
			if (first % 1 === 1 && second % 1 === 1) {
				return parseInt(first) + parseInt(second);
			} else {
				return parseFloat(first) + parseFloat(second);
			}
		case "-": return first - second;
		case "*": return first * second;
		case "/": return first / second;
		case "%": return first * second / 100;
		case "^": return Math.pow(first, second);
		case "M": return first % second;
	}
}

function toDegrees(angle) {
	return angle * (180 / Math.PI);
}

/* Bugs:
1. 9999 + backspace 9999 = -> NaN.
2. Unable to do multiple operations: 66+22-11 = 11 (22-11) (+= on adding is removed for now).
   - when pressed a second sign, equal the first two numbers, set them as first_number and then do again.
3. = with valid case keeps performing the action.
*/