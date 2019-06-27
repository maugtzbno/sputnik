// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function (example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples: function () {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function (id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  },
  getPortfolio: function () {
    return $.ajax({
      url: "api/allportfolios",
      type: "GET"
    });
  },
  getReturns: function () {
    return $.ajax({
      url: "api/allreturns",
      type: "GET"
    })
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function () {
  API.getExamples().then(function (data) {
    var $examples = data.map(function (example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function (event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function () {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function () {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function () {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);

//-----------------------------------------------------------------------//
//***********************************************************************//

$("#segunda_pregunta").hide();
$("#tercera_pregunta").hide();
$("#cuarta_pregunta").hide();


$("#primera_buena").click(function() {
  $("#primera_pregunta").hide();
  $("#segunda_pregunta").show();
});

$("#primera_mala").click(function() {
  $("#primera_pregunta").hide();
  console.log("No te encuentras en edad de invertir");
});

$("#2buena").click(function() {
  $("#segunda_pregunta").hide();
  $("#tercera_pregunta").show();
});

$("#2mala").click(function() {
  $("#segunda_pregunta").hide();
  console.log("Es importante tener un ahorro para emergencias!");
});

$("#3buena").click(function() {
  $("#tercera_pregunta").hide();
  $("#cuarta_pregunta").show();
  console.log("puedes invertir");
});

$(".perfil").click(function() {
  $("#cuarta_pregunta").hide();



  console.log("tu perfil de riesgo es: " + $(this).data("rsk"));
  rsk = $(this).data("rsk").toUpperCase();
  console.log(rsk);

  var data = [];

  API.getPortfolio().then(function (res) {
    //let data = [];
    for (let i = 0; i < res.length; i++) {
      if (res[i].name === rsk) {
        data = [res[i].shv, res[i].slqd, res[i].hyg, res[i].ivv, res[i].iev, res[i].eem, res[i].ewj];
      }

    }
    console.log("primer", data);
    newChart(data);
  });


  API.getReturns().then(function (res) {

    console.log(data);
    console.log(res);

    let ret = {
      yearmonth: [],
      SHV: [],
      SLQD: [],
      HYG: [],
      IVV: [],
      IEV: [],
      EEM: [],
      EWJ: []
    }

    console.log(ret);

    for (let i = 0; i < res.length; i++) {
      if (res[i].yearmonth > 201405) {

        if (ret.yearmonth.indexOf(res[i].yearmonth) === -1) {
          ret.yearmonth.push(res[i].yearmonth);
        }

        if (res[i].ETF === "SHV") {
          ret.SHV.push(res[i].yield * data[0]);
        }
        if (res[i].ETF === "SLQD") {
          ret.SLQD.push(res[i].yield * data[1]);
        }
        if (res[i].ETF === "HYG") {
          ret.HYG.push(res[i].yield * data[2]);
        }
        if (res[i].ETF === "IVV") {
          ret.IVV.push(res[i].yield * data[3]);
        }
        if (res[i].ETF === "IEV") {
          ret.IEV.push(res[i].yield * data[4]);
        }
        if (res[i].ETF === "EEM") {
          ret.EEM.push(res[i].yield * data[5]);
        }
        if (res[i].ETF === "EWJ") {
          ret.EWJ.push(res[i].yield * data[6]);
        }
      }


    }

    //For to calculate total return
    monthly = [];
    accumulated = [];

    for (let i = 0; i < ret.yearmonth.length; i++) {
      monthly.push(ret.SHV[i] + ret.SLQD[i] + ret.HYG[i] + ret.IVV[i] + ret.IEV[i] + ret.EEM[i] + ret.EWJ[i]);

      if (i === 0) {
        accumulated.push(monthly[0]);
      } else {
        accumulated.push((accumulated[i - 1] + 1) * (monthly[i] + 1) - 1);
      }

    }
    //console.log("antes de mixed chart", ret);
    //console.log("mixed chart yearmonth", ret)

    console.log(monthly, accumulated);

    mixChart(ret.yearmonth, monthly, accumulated);

    sortMonthly = monthly;
    sortMonthly.sort();

    barChart(sortMonthly);

  })
});

function newChart(pcte) {

  var ctx = document.getElementById("myChart");

  new Chart(document.getElementById("myChart"), {
    type: "doughnut",
    data: {
      labels: ["SHV", "SLQD", "HYG", "IVV", "IEV", "EEM", "EWJ"],
      datasets: [{
        label: "ETF",
        backgroundColor: [
          "rgb(20,8,9)", 
          "rgb(155,48,65)", 
          "rgb(128,155,167)", 
          "rgb(65,75,139)", 
          "rgb(57,7,11)", 
          "rgb(72,81,97)", 
          "rgb(41,43,88)"
          // "#3e95cd",
          // "#8e5ea2",
          // "#3cba9f",
          // "#e8c3b9",
          // "#c45850",
          // "#4286f4",
          // "#ce0808"
        ],
        data: pcte
      }]
    },
    options: {
      title: {
        display: true,
        text: "Portfolio"
      }
    }
  });
}

function mixChart(meses, retmeses, retaccum) {

  var ctx = document.getElementById("mixChart");

  new Chart(document.getElementById("mixChart"), {
    type: 'bar',
    data: {
      labels: meses,
      datasets: [{
        label: "Accum",
        type: "line",
        borderColor: "rgb(65,75,139)",
        data: retaccum,
        fill: false
      }, {
        label: "Monthly",
        type: "bar",
        backgroundColor: "rgb(72,81,97)",
        data: retmeses,
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Portfolio Strategy'
      },
      legend: {
        display: false
      }
    }
  });
}

function barChart(retmeses) {

  var max = Math.max.apply(null, retmeses);
  console.log("maximo", max);
  var min = Math.min.apply(null,retmeses);
  console.log("minimo", min);
  var rng = (max-min)/9;
  console.log(rng);
  etiquetas = [];
  freq = [0,0,0,0,0,0,0,0,0];

  for (let i = 0; i < 9; i++) {
    const a = min + rng*(i);
    const b = min + rng*(i+1);
    const lab = `${a.toFixed(2)*100}% --- ${b.toFixed(2)*100}%`;
    console.log(lab);
    etiquetas.push(lab);
  }

  for (let i = 1; i < retmeses.length; i++) {
    if (retmeses[i]>min && retmeses[i]<min+rng) {
      freq[0] +=1;
    }
    if (retmeses[i]>min+rng && retmeses[i]<min+2*rng) {
      freq[1] +=1;
    }
    if (retmeses[i]>min+2*rng && retmeses[i]<min+3*rng) {
      freq[2] +=1;
    }
    if (retmeses[i]>min+3*rng && retmeses[i]<min+4*rng) {
      freq[3] +=1;
    }
    if (retmeses[i]>min+4*rng && retmeses[i]<min+5*rng) {
      freq[4] +=1;
    }
    if (retmeses[i]>min+5*rng && retmeses[i]<min+6*rng) {
      freq[5] +=1;
    }
    if (retmeses[i]>min+6*rng && retmeses[i]<min+7*rng) {
      freq[6] +=1;
    }
    if (retmeses[i]>min+7*rng && retmeses[i]<min+8*rng) {
      freq[7] +=1;
    }
    if (retmeses[i]>min+8*rng && retmeses[i]<max) {
      freq[8] +=1;
    }
  }

  var ctx = document.getElementById("barChart");
  // Bar chart
  new Chart(document.getElementById("barChart"), {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: [{
        label: "Frequency",
        backgroundColor: ["rgb(208,196,191)", "rgb(97,15,18)", "rgb(20,8,9)", "rgb(155,48,65)", "rgb(128,155,167)", "rgb(65,75,139)", "rgb(57,7,11)", "rgb(72,81,97)", "rgb(41,43,88)"],
        data: freq
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Monthly Returns since Jun 2014'
      }
    }
  });
}