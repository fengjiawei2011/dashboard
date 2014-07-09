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
			// flotLineChart.draw();
		 }
		callback();
	 };
	 
	 // draw all line charts
	 this.drawLineCharts = function(){ 
		 for(var i = 0; i < this.lineCharts.length; i++){
			var dataset = this.lineCharts[i].getDataset();
			this.lineCharts[i].draw( dataset );
		 }
	 }; 
	 
	 // layout the whole dashboard GUI
	 this.layout = function(){
		 this.drawBackToTopButton();
		 this.drawAlertsMonitor();
		 this.drawDateFilter();
		 this.drawChartsContainer();
		 this.drawDialog();
	 };
	 
	 this.drawBackToTopButton = function(){
		 var html = '<div style="position:fixed;right:10px;top:40%;"><a href="#top" type="button" class="btn btn-primary btn-block">Back To Top</a></div>'; 
		 var htmlTop = '<div id = "top"></div>';
			 
		 $('body').prepend(htmlTop);
		 $('body').append(html);	 	
	 }
	 
	 this.drawAlertsMonitor = function(){
		 var html = "<div id='monitor' class='row'>";
		 
		 for(var i = 0 ; i < this.datasets.length; i++ ){
			 html    += '<div  class="col-md-1" style="margin-bottom: 10px">';
			 
			 switch(this.getAlertStatus(this.datasets[i].alertId)){
				 case 'green' :{
					 html    += '<a href=#'+ this.datasets[i].alertId +' alertId='+this.datasets[i].alertId+' type="button" class="btn btn-success btn-block">';
					 break;
				 }
				 case 'yellow':{
					 html    += '<a href=#'+ this.datasets[i].alertId +' alertId='+this.datasets[i].alertId+' type="button" class="btn btn-warning btn-block">';
					 break;
				 }
				 case 'red'   :{
					 html    += '<a href=#'+ this.datasets[i].alertId +' alertId='+this.datasets[i].alertId+' type="button" class="btn btn-danger btn-block">';
					 break;
				 }
			 }
			
			 html    += this.datasets[i].alertId;
			 html    += '<br/>';
			 html    += this.datasets[i].alertData[this.datasets[i].alertData.length-1].alertValue;
			 html    += '</a></div>';
		 } 
	
		 html    += '</div>';
		 
		 $("#dashboard").append(html);
	 };
	 
	 this.drawDateFilter = function(){
		 var html = "<div id='filter' style='margin-left: auto;margin-right: auto; margin-bottom:30px; width: 80%'>";
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
	 
	 this.search = function(from , to){
		if(from === '' && to === ''){
			this.drawLineCharts();
			 callback();
			 return;
		}else{
			 for(var i = 0 ; i < this.lineCharts.length; i++){
				 var ds =  this.lineCharts[i].filterByDate( from , to );
				 //console.log(JSON.stringify(ds));
				 this.lineCharts[i].draw( ds );
			 }
			// callback("success");
		}
	 };
	 
	 /*
	  *  'green'  means no alert 
	  *  'yellow' means warning
	  *  'red'    means alert
	  */
	 
	 this.getAlertLastestData = function(alertId){
		 var alertData = this.getDatasets(alertId);
		// console.log(alertData[alertData.length - 1]);
		 return  alertData[alertData.length - 1];
	 };
	 
	 this.isTriggered = function(alertId , days){  // days means if alert is triggered within days 
		// console.log(this.getAlertLastestData(alertId).alertTime);
		 var time = new Date(this.getAlertLastestData(alertId).alertTime);
		 if(new Date() > time.setDate(time.getDate() + days)) return false;
		 else return true;
	 };
	 
	 this.getAlertStatus = function(alertId){ 
		 var matedata = this.getMatedata(alertId);
		 var alertValue = this.getAlertLastestData(alertId).alertValue;
		 if(!this.isTriggered(alertId, 33)){
			 return "green";
		 }else{
			 if(alertValue >= matedata.warningStart && alertValue <= matedata.warningEnd)
				 return "yellow";
			 
			 if(alertValue >= matedata.alertStart )
				 return "red";
		 }
	 };
	 
	 this.getMatedata = function(alertId){
		 for(var i = 0; i < this.datasets.length; i++)
			 if( this.datasets[i].alertId === alertId ) 
				 return this.datasets[i].matedata;
	 };
	 
	 this.getDatasets = function(alertId){
		 for(var i = 0; i < this.datasets.length; i++){
			 if(this.datasets[i].alertId === alertId)
				 return this.datasets[i].alertData;
		 }	
	 };
	 
	 this.getUtil = function(){
		 return this.myUtil;
	 };
	 this.block = function(){
		 console.log("block");
		 $.blockUI({ css: { 
	            border: 'none', 
	            padding: '15px', 
	            backgroundColor: '#000', 
	            '-webkit-border-radius': '10px', 
	            '-moz-border-radius': '10px', 
	            opacity: .5, 
	            color: '#fff' 
	        } }); 
	 };
	 this.unblock = function(){
		 $.unblockUI();
	 };
}

// class FlotLineChart
function FlotLineChart(alertId, dataset, matedata){
	this.alertId = alertId;
	this.dataset = dataset; // JSON format dataset like {alertId : '', alertData : [{},{}], matedata : {} }
	this.matedata = matedata;
	this.option = new Option(); // it is a object of line chart option for customizing line chart
	
	// draw chart
	this.draw = function( dataset ){	
		//console.log(JSON.stringify(dataset));
		if($("#"+this.alertId).html() == '' || $("#"+this.alertId).html() == null ){
			var html = "<div class='col-md-6 model-shadow' >";
			html    += "<div class='chart-title'>";
			html    += matedata.alertName;
			html    += "</div>";
			html    += "<div class='chart' id='";
			html    += this.alertId;
			html    += "' data-toggle='modal' data-target='#myModal1'>";	
			html    += "</div></div>"
			$('#chartsContainer').append(html);
		}	
		this.improveDateAppranceOnXaxis( dataset );
		$.plot($("#"+this.alertId), dataset, this.option.getOption());
	}; 
	
	this.improveDateAppranceOnXaxis = function(dataset){
		if(dataset[0].data.length === 0){
			return;
		}
		var from = dataset[0].data[0][0];
		var to = dataset[0].data[dataset[0].data.length-1][0];
		// get first date in dataset
		var firstDate = new Date(from);
		//get last date in dataset
		var lastDate = new Date(to);
		
		var yearOfFirst = firstDate.getFullYear(),
			monthOfFirst = firstDate.getMonth() + 1,
			dateOfFirst = firstDate.getDate();
		
		var yearOfLast = lastDate.getFullYear(),
			monthOfFLast = lastDate.getMonth() + 1,
			dateOfLast = lastDate.getDate();
		
		var alertName = this.matedata.alertName;
		if(yearOfFirst === yearOfLast){
			if(monthOfFirst === monthOfFLast){
				this.option.setTickSize(1, "day");
				//this.option.setAxisLabel(alertName);
				//this.setLabel(this.alertId + "( "+ (parseInt(monthOfFirst) < 10 ? '0'+monthOfFirst : monthOfFirst) + "/" + yearOfFirst + " )");
				dataset[0].label = this.alertId + "( "+ (parseInt(monthOfFirst) < 10 ? '0'+monthOfFirst : monthOfFirst) + "/" + yearOfFirst + " )";
			}else if( (monthOfFLast - monthOfFirst) > 3 ){
				this.option.setTickSize(1, "month");
				//this.option.setAxisLabel(alertName);
				//this.setLabel(this.alertId + "( "+ yearOfFirst + " )");
				dataset[0].label = this.alertId + "( "+ yearOfFirst + " )";
			}else{
				this.option.setTickSize(7, "day");
				//this.option.setAxisLabel(alertName);
				//this.setLabel(this.alertId + "( "+ yearOfFirst + " )");
				dataset[0].label = this.alertId + "( "+ yearOfFirst + " )";
			}
		}else if( (yearOfLast - yearOfFirst) > 3){
			this.option.setTickSize(1, "year");
			//this.option.setAxisLabel(alertName);
			//this.setLabel(this.alertId + "( "+ yearOfFirst + " - "+ yearOfLast + " )");
			dataset[0].label = this.alertId + "( "+ yearOfFirst + " - "+ yearOfLast + " )";
		}else{
			this.option.setTickSize(2, "month");
			//this.option.setAxisLabel(alertName);
			//this.setLabel(this.alertId + "( "+ yearOfFirst + " - "+ yearOfLast + " )");
			dataset[0].label = this.alertId + "( "+ yearOfFirst + " - "+ yearOfLast + " )";
		}
	};
	
	
	//return new datasets
	this.filterByDate = function(from , to){
		var ds = this.dataset[0].data;
		var newDS = [];
		for(var i = 0; i < ds.length; i++){
			if( from === '' && to !== ''){
				if(ds[i][0] <= to) newDS.push(ds[i]);
			}else if( from !== '' && to === ''){
				if( ds[i][0] >= from ) newDS.push(ds[i]);	
			}else{
				if(ds[i][0] >= from && ds[i][0] <= to) newDS.push(ds[i]);	
			}
		}
		return [{
			label : this.alertId,
			data  : newDS
		}];
	};
	
	this.setLabel   = function(label){this.dataset[0].label = label;};
	this.getDataset = function(){return this.dataset;};
}

// class Option for line chart 
function Option(){
	this.option = {};
	
	this.setTickSize = function(span , dateType){
		this.option = this.getDefault();
		this.option.xaxis.tickSize = [span, dateType];
	};
	this.setAxisLabel = function(str){
		 this.option.xaxis.axisLabel = axisLabel;
	};
	this.setTimeFormat = function(){};
	
	this.getOption = function(){
		//console.log(this.option);
		if(JSON.stringify(this.option) !== '{}') return this.option;
		else return this.getDefault();	
	};

	this.getDefault = function(){
		return{
			axisLabels : {
				show : true
			},
			xaxis :{
				mode : 'time',
				//timeformat : '%m/%d/%y',
				tickSize : [ 3, 'month' ],
				axisLabel :'',
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
					radius : 1,
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
			data : flotFormatDataset
			//hoverable: true
		} ];
	};
	
	this.isValidated = function( field ){
		var flag = false;
		switch( field ){
			case 'search' : {
				var from = $('#from').val();
				var to = $('#to').val();
				
				if( from !== '' && to !== ''){
					if(new Date(from) > new Date(to)){
						alert('Please select correct time ( from <= to)');
					}else{
						flag = true;
					}
				}else{
					alert("date cann't be empty!");
				}
				break;
			}	
			default : ;
		}
		
		return flag;
	};
}

