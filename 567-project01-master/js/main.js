/****************************************************************
 * 'main.js'
 * Main file for program
 *
 * Author/CopyRight: Mancuso, Logan
 * 										Zheng, Kevin
 * Last Edit date: 01-16-2019--12:00:46
 *
 **/

var prev;

document.getElementById('StateForum').onclick = function () {
	// this (keyword) refers to form to which onsubmit attached
	// 'SC' is name of radio button group
	var val = getRadioVal(this, 'SC');
	if (prev != val) {
		d3.selectAll("svg").remove()
	}
	setlocal(val);			

	// plot(val);
}

function getRadioVal(form, name) {
	var val;
	// get list of radio buttons with specified name
	var radios = form.elements[name];
	// loop through list of radio buttons
	for (var i = 0, len = radios.length; i < len; i++) {
		if (radios[i].checked) { // radio checked?
			val = radios[i].value; // if so, hold its value in val
			break; // and break out of for loop
		}
	}
	return val; // return value of checked radio or undefined if none checked
}

// set the dimensions and margins of the graph

var margin = {
	left: 300,
	right: -300,
	top: 50,
	bottom: 100
};
var scale = .67;
height = (700 * scale) - margin.top - margin.bottom,
	width = (1500 * scale) - margin.left - margin.right;

// parse the date / time
var parseTime = d3.timeParse("%Y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

function setlocal(id) {
	var xval,
		yval;
	switch (id) {
		case "USC00381479":
			xval = 0;
			yval = 0;
			break;
		case "USW00053867":
			xval = 0;
			yval = 0;
			break;
		case "US1SCLX0054":
			xval = 0;
			yval = 0;
			break;
		case "USC00387683":
			xval = 0;
			yval = 0;
			break;
		case "USC00387666":
			xval = 0;
			yval = 0;
			break;
		case "USC00381944":
			xval = 0;
			yval = 0;
			break;
		case "USW00013883":
			xval = 0;
			yval = 0;
			break;
		default:
			text = "error";
	}
	plot(id,xval,yval);
}

function plot(id) {

	// define the line
	var valueline = d3.line()
		.x(function (d) {
			return x(d.DATE);
		})
		.y(function (d) {
			return y(d.TAVG);
		});

	// append the svg obgect to the body of the page
	// appends a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right + 400)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	svg.append("text")
		.attr("y", height - 550)
		.attr("x", width - 750)
		.attr("font-size", "30px")
		.attr("text-anchor", "middle")
		.attr("fill", "#6f3758")
		.text("Average Temperature");

	svg.append("text")
		.attr("y", height + 50)
		.attr("x", width - 600)
		.attr("font-size", "30px")
		.attr("text-anchor", "middle")
		.attr("fill", "#6f3758")
		.text("Year");

	svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -30)
		.attr("x", -170)
		.attr("font-size", "30px")
		.attr("text-anchor", "middle")
		.text("Temperature (F)")
		.attr("fill", "#6f3758")

	var div = d3.select("body").append("div");


	// Get the data
	d3.json("data/data.json").then(function (data) {

		var data = data[id];

		// format the data
		data.forEach(function (d) {
			d.DATE = parseTime(d.DATE); // Dates on the x-axis 
			d.TAVG = +d.TAVG;
		});

		// sort years ascending
		data.sort(function (a, b) {
			return a["DATE"] - b["DATE"];
		})

		// Scale the range of the data
		x.domain(d3.extent(data, function (d) {
			return d.DATE;
		}));

		y.domain([0, d3.max(data, function (d) {
			return d.TMAX;
		})]);

		// Add the valueline path.
		svg.append("path")
			.data([data])
			.attr("class", "line")
			.attr("d", valueline)
			.style("stroke-width", 4)
			.attr("stroke", "#376f4e")
			.attr("fill", "none");

		svg.selectAll("dot")
			.data(data)
			.enter()
			.append("circle")
			.attr("r", 5)
			.attr("cx", function (d) {
				return x(d.DATE);
			})
			.attr("cy", function (d) {
				return y(d.TAVG);
			})
			.style("fill", "#6f4e37")
			.on("mouseover", function (d) {
				div.transition()
				div.html(
						"Common Name: " + "<span style='color: #6f3758'>" + d.NAME + "</span>" + "<br/>" +
						"Station Number: " + "<span style='color: #6f3758'>" + d.STATION + "</span>" + "<br/>" +
						"Maximum Temperature: " + "<span style='color: #6f3758'>" + d.TMAX + "F</span>" + "<br/>" +
						"Average Temperature: " + "<span style='color: #6f3758'>" + d.TAVG + "F</span>" + "<br/>" +
						"Minimum Temperature: " + "<span style='color: #6f3758'>" + d.TMIN + "F</span>" + "<br/>" +
						"Precipitation: " + "<span style='color: #6f3758'>" + d.PRCP + "ft</span>" + "<br/>"
					)
					.style("opacity", .9)
					.style("font-size", "25px")
				d3.select(this)
					.style("fill", "#37586f");
			})
			.on("mouseout", function (d) {
				div.transition()
					.style("opacity", 0)
				d3.select(this)
					.style("fill", "#6f4e37");
			});
		// Add the X Axis
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		// Add the Y Axis
		svg.append("g")
			.call(d3.axisLeft(y));
	});
}