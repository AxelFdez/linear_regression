const fs = require('fs');
const { exit } = require('process');
let theta0;
let theta1;

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
let x = [];
let y = [];
for (let i = 1; i < data.length; i++) {
	if (data[i] == ""){
		data.splice(i, 1);
		i--;
		continue;
	}
    const row = data[i].split(',');
	if (!isDigit(row[0]) || !isDigit(row[1])){
		console.log("error with data");
		exit();
	}
	let mileage = parseInt(row[0]);
	let price = parseInt(row[1]);
	if (mileage == "" || price == "" || isNaN(mileage) || isNaN(price)
			|| mileage <= 0 || price <= 0 || mileage > 300000 || price > 10000){
			console.log("error with data");
			exit();
	}
    x.push(mileage);
    y.push(price);
}

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

function estimatePrice(mileage, theta0, theta1) {
    return theta0 + theta1 * mileage;
}

// generate linear regression line
const regressionLineX = [];
const regressionLineY = [];
for (let i = 0; i < x.length; i++) {
    regressionLineX.push(x[i]);
    regressionLineY.push(estimatePrice(x[i] / 10000, theta0, theta1) * 1000);
}

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Price vs Mileage</title>
    <script src="https://cdn.plot.ly/plotly-2.31.1.min.js" charset="utf-8"></script>
</head>
<body>
    <div id="graph"></div>
    <script>
        Plotly.newPlot('graph', [{
            x: ${JSON.stringify(x)},
            y: ${JSON.stringify(y)},
            mode: 'markers',
            type: 'scatter',
			name: 'Car Quotations'
        },
		{
			x: ${JSON.stringify(regressionLineX)},
			y: ${JSON.stringify(regressionLineY)},
			mode: 'lines',
			type: 'scatter',
			name: 'Regression Line'
		}], {
            title: 'Price vs Mileage',
            xaxis: { title: 'Mileage(km)' },
            yaxis: { title: 'Price($)' }
        });
    </script>
</body>
</html>
`;

try {
	const filePath = 'graph.html';
	fs.writeFileSync(filePath, htmlContent);
	console.log('HTML file created successfully.');
}
catch (e) {
	console.log('Error writing HTML file.');
}


function isDigit(s) {
	for (let i = 0; i < s.length; i++) {
	  if (s[i] < '0' || s[i] > '9') {
		return false;
	  }
	}
	return true;
  }