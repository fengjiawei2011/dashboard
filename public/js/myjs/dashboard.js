// class Dashboard 
function Dashboard(datasets){ // datasets is an array 
	
	 this.myUtil = new MyUtil();
	 this.lineCharts = []; // flotLineChartArray --- to save all line charts 
	 this.datasets = datasets;
	 //console.log(datasets);
	 this.init = function(callback){
		 for(var i = 0; i < this.datasets.length; i++){
			 var alertId = this.datasets[i].alertId;
			 var dataset = this.myUtil.parse2FlotDataset(alertId, this.datasets[i].alertData);
			 var matedata = datasets[i].matedata;
			 var flotLineChart = new FlotLineChart(alertId, dataset , matedata);
			 this.lineCharts.push(flotLineChart); 
			
		 }
		callback();
	 };
	 
	 // draw all line charts
	 this.drawLineCharts = function(){ 
		 for(var i = 0; i < this.lineCharts.length; i++){
			this.lineCharts[i].draw();
		 }
	 }; 
	 
	 this.draw = function(){
		 this.drawAlertsMonitor();
		 this.drawDateFilter();
		 this.drawDialog();
	 }
	 
	 this.drawAlertsMonitor = function(){};
	 
	 this.drawDateFilter = function(){
		 var html = "<span>From : <input type='text' id='from' class='calendar' /></span>";
		 html    += "<span>To   :<input type='text' id='to' class='calendar' /></span>";
		 html    += "<button>go</button>";
		 $("#filter").append(html);
		 $( ".calendar" ).datepicker({
		      changeMonth: true,
		      changeYear: true
		 });	 
	 };
	 
	 this.drawDialog = function(){};
	 this.search = function(from , to){};
}

// class FlotLineChart
function FlotLineChart(alertId, dataset, matedata){
	this.alertId = alertId;
	this.dataset = dataset; // JSON format dataset like {alertId : '', alertData : [{},{}], matedata : {} }
	this.matedata = matedata;
	this.option = new Option().getDefault(); // it is a object of line chart option for customizing line chart
	
	// draw chart
	this.draw = function(){	
		if($("#"+this.alertId).html() == '' || $("#"+this.alertId).html() == null ){
			
			var html = "<div class='col-md-6 chart' id='"+this.alertId+"' data-toggle='modal' data-target='#myModal1'></div>";
			
			$('#chartsContainer').append(html);
			
		}	
		$.plot($("#"+this.alertId), this.dataset, this.option);
	}; 
}

// class Option for line chart 
function Option(){
	
	this.setTickSize = function(span , dateType){};
	this.setTimeFormat = function(){};

	this.getDefault = function(){
		return{
			axisLabels : {
				show : true
			},
			xaxis :{
				mode : 'time',
				timeformat : '%m/%d/%y',
				tickSize : [ 3, 'month' ],
				axisLabel :'alertName',
				axisLabelUseCanvas : true,
				axisLabelFontSizePixels : 12,
				axisLabelFontFamily : 'Verdana, Arial',
				axisLabelPadding : 10
			}, 
			series : {
				lines : {
					show : true,
					fill : false,
					fillColor : {
						colors : [ {
							opacity : 0.7
						}, {
							opacity : 0.1
						} ]
					},
					steps : false
				},
				points : {
					radius : 5,
					show : true
				}
			},
		    grid: {
		        hoverable: true,
		        borderWidth: 2,
		        mouseActiveRadius: 50,
		        //backgroundColor: { colors: ["#ffffff", "#EDF5FF"] },
		        axisMargin: 20,
		    }	
		};
	};
}

// my util class 
function MyUtil(){
	this.parse2FlotDataset = function(alertId, alertData){
		var flotFormatDataset = [];
		for(var i = 0; i < alertData.length; i++){
			var time = new Date(alertData[i].alertTime).getTime();
			var temp = [time, alertData[i].alertValue];
			flotFormatDataset.push(temp);
		}
		return [ {
			label : alertId,
			data : flotFormatDataset,
			//hoverable: true
		} ];
	};
}

var f = new FlotLineChart();
//console.log(f.setOption());