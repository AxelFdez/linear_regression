const fs = require('fs');
const { exit } = require('process');


function estimatePrice(mileage, theta0, theta1){
	return theta0 + theta1 * mileage;
}

function gradientDescent(learningRate, quotation, theta0, theta1){

	let tmpTheta0 = 0;
	let tmpTheta1 = 0;

	for (let i = 0; i < quotation.length; i++) {
		let mileage = parseInt(quotation[i][0]) / 10000;
		let price = parseInt(quotation[i][1]) / 1000;
		tmpTheta0 += (estimatePrice(mileage, theta0, theta1) - price);
		tmpTheta1 += ((estimatePrice(mileage, theta0, theta1) - price) * mileage);
	}
	tmpTheta0 *= (learningRate / quotation.length);
	tmpTheta1 *= (learningRate / quotation.length);

	theta0 -= tmpTheta0;
	theta1 -= tmpTheta1;

	return [theta0, theta1];
}

function train()
{
	let theta0 = 0;
	let theta1 = 0;
	const learningRate = 0.01;
	const iterations = 10000;

	let file;
	try {
		file = fs.readFileSync('data.csv');
	}
	catch (e) {
		console.log("error with file");
		exit();
	}

	const data = file.toString().split('\n');
	if (data.length <= 1){
		console.log("error with data");
		exit();
	}
	quotation = [];

	for (let i = 1; i < data.length; i++)
	{
		if (data[i] == ""){
			data.splice(i, 1);
			i--;
			continue;
		}
		quotation.push(data[i].split(','));
		if (!isDigit(quotation[i - 1][0]) || !isDigit(quotation[i - 1][1])){
			console.log("error with data");
			exit();
		}
		let mileage = parseInt(quotation[i - 1][0]);
		let price = parseInt(quotation[i - 1][1]);
		if (mileage == "" || price == "" || isNaN(mileage) || isNaN(price)
			|| mileage <= 0 || price <= 0 || mileage > 300000 || price > 10000){
			console.log("error with data");
			exit();
		}
	}

	for (let i = 0; i < iterations; i++)
	{
		[theta0, theta1] = gradientDescent(learningRate, quotation, theta0, theta1);
	}
	fs.writeFileSync('theta0.json', theta0.toString());
	fs.writeFileSync('theta1.json', theta1.toString());

	console.log("training done!")
	exit();
}

train();

function isDigit(s) {
	for (let i = 0; i < s.length; i++) {
	  if (s[i] < '0' || s[i] > '9') {
		return false;
	  }
	}
	return true;
  }