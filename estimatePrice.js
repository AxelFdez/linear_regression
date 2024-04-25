const readline = require('readline');
let theta0;
let theta1;
try {
	theta0 = parseFloat(require('./theta0.json'));
	theta1 = parseFloat(require('./theta1.json'));
	if (isNaN(theta0) || isNaN(theta1)){
		throw "error";
	}
}
catch (e) {
	theta0 = 0;
	theta1 = 0;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function estimatePrice(mileage){
	return theta0 + theta1 * mileage;
}

function app(){
	rl.question('Enter the mileage of the car, to get price estimation: ', (mileage) => {
		mileage = parseInt(mileage);
		if (isNaN(mileage) || mileage <= 0 || mileage > 300000){
			console.log("Please enter a valid number between 1 and 3000000");
			app();
			return;
		}
		console.log("Estimate Price : ", Math.round(estimatePrice(mileage / 10000) * 1000), "$");
		rl.close();
	  });
}

app();