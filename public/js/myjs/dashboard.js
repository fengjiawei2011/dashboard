// class Dashboard 
function Dashboard(datasets){ // datasets is an array 
	
	 this.myUtil = new MyUtil();
	 this.lineCharts = []; // flotLineChartArray --- to save all line charts 
	 this.datasets = datasets;
	 //console.log(datasets);
	 this.initLineChartsArray = function(callback){
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
	 
	 // layout the whole dashboard GUI
	 this.layout = function(){
		 this.drawAlertsMonitor();
		 this.drawDateFilter();
		 this.drawChartsContainer();
		 this.drawDialog();
	 }
	 
	 this.drawAlertsMonitor = function(){
		 var html = "<div id='monitor' class='row'>";
		 
		 for(var i = 0 ; i < this.datasets.length; i++ ){
			 html    += '<div  class="col-md-1" style="margin-bottom: 10px">';
			 if(this.datasets[i].matedata.alertFlag === 'Y')
				 html    += '<button  type="button" class="btn btn-success btn-block">';
			 else 
				 html    += '<button  type="button" class="btn btn-danger btn-block">';
			 html    += this.datasets[i].alertId;
			 html    += '<br/>';
			 html    += this.datasets[i].alertData[this.datasets[i].alertData.length-1].alertValue;
			 html    += '</button></div>';
		 } 
	
		 html    += '</div>';
		 
		 $("#dashboard").append(html);
	 };
	 
	 this.drawDateFilter = function(){
		 var html = "<div id='filter' style='margin-left: auto;margin-right: auto; margin-bottom:30px; width: 80%'></div>";
		 html    += "<span>From : <input type='text' id='from' class='calendar' /></span>";
		 html    += "<span>To   :<input type='text' id='to' class='calendar' /></span>";
		 html    += "<button>go</button>";
		 html    += "</div>";
		 
		 $("#dashboard").append(html);
		 $( ".calendar" ).datepicker({
		      changeMonth: true,
		      changeYear: true
		 });	 
	 };
	 
	 this.drawChartsContainer = function(){
		 var html = "<div id='chartsContainer' class='row'>";
		 html    += '</div>';
		 $("#dashboard").append(html);
	 };
	 
	 this.drawDialog = function(){
		 var html = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
		 html    += '<div class="modal-dialog modal-lg">';
		 html    += '<div class="modal-content">';
		 html    += '<div class="modal-header">';
		 html    += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
		 html    += '<h4 class="modal-title" id="myModalLabel">Matedata</h4>';
		 html    += '</div>';
		 
		 html    += '<div class="modal-body">';
		 html    += '';  // add matedata here 
		 html    += '</div>';
		 
//		 html    += '<div class="modal-footer">';
//		 html    += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
//		 html    += '<button type="button" class="btn btn-primary">Save changes</button>';
//		 html    += '</div>';
		 
		 html    += '</div></div></div>';
		 
		 $("body").append(html);
	 };
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

//var f = new FlotLineChart();
//console.log(f.setOption());