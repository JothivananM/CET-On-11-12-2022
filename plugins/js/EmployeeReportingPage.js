let empID = primaryDetails.EmployeeId; 
let internalID = primaryDetails.BusinessPartnerId;

let monthlyReportData = [];

let projectList=[];
let taskList =[];
let activityList=[];
let schoolList=[];
let statusList=[];

let projectName;
let projectTask;
let school;
let activity;
let statusreport;
let firstDate;
let lastDate ;

function setDate(){
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    
    firstDate = new Date(firstDay).toISOString().split('T')[0];
    lastDate = new Date(lastDay).toISOString().split('T')[0];

    $('#fromdate').val(firstDate);
    $('#todate').val(lastDate);
}


function employeeReportingList() {
    $('.select2').select2(
        {
            dropdownAutoWidth: true,
        },
    );
    
    setDate();
    $("#exampleModalCenter").modal("show");

    $.ajax({
        type: "GET",
        url: httpURL+"/timesheetbookedmonthreport?BusinessPartnerId="+internalID+"&startDate="+firstDate+"&endDate="+lastDate,
        
        // url: "https://lj8f09lng9.execute-api.eu-central-1.amazonaws.com/Prod/employeeDetails?employeeMailId=vignesh.lakshminarayanan@nipurnait.com",
        dataType: "json",
        // async:false,
        success: function (successdata) {
            monthlyReportData = successdata.MonthlyReport;
            generateEmployeeReportingTable(monthlyReportData, "employeereportingtable");
            
            setTimeout(function() {
                $("#exampleModalCenter").modal("hide");
            }, 1000);
            
            projectList = [...new Map(monthlyReportData.map(item => [item.ProjectID, item])).values()];
            projectList.forEach((element) => {
                if(element.ProjectName !="" && element.ProjectName != "undefined"  ){
                    $("#projectname").append("<option>" + element.ProjectName + "</option>");
                }
            });

            taskList = [...new Map(monthlyReportData.map(item => [item.TaskName, item])).values()];
            taskList.forEach((element) => {
                if(element.TaskName !="" && element.TaskName != "undefined"  ){
                    $("#projecttask").append("<option>" + element.TaskName + "</option>");
                }
            });

            activityList = [...new Map(monthlyReportData.map(item => [item.ActivityName, item])).values()];
            activityList.forEach((element) =>{
                if(element.ActivityName !="" && element.ActivityName != "undefined"  ){
                    $("#activity").append("<option>" + element.ActivityName + "</option>");
                }
            });

            schoolList = [...new Map(monthlyReportData.map(item => [item.SchoolDescription, item])).values()];
            schoolList.forEach((element) => {
                if(element.SchoolDescription !="" && element.SchoolDescription != "undefined"  ){
                    $("#school").append("<option>" + element.SchoolDescription + "</option>");
                }
            });
            statusList = [...new Map(monthlyReportData.map(item => [item.Status, item])).values()];
            statusList.forEach((element) => {
                if(element.Status !="" && element.Status != "undefined"  ){
                    $("#status").append("<option>" + element.Status + "</option>");
                }
            });
            
            
           
            
        },
        error: function (response,error,message) {
            setTimeout(function() {
                $("#exampleModalCenter").modal("hide");
            }, 1000);
            
            toastr.error("Error Occurred While Processing... Please Try Again or Contact Adiministrator", "Error : " +response.status, { timeOut: 4000 });

            // alert("error : " + response.status);
            // console.log(JSON.stringify(response.responseJSON.statusCode));
            // console.log(JSON.stringify(response.responseJSON.body));
        },
    });


}

function tableProjectFilter() {
    projectName = $("#projectname").children("option:selected").val();

    if (projectName === "") {

        $('#projecttask').find('option').remove().end().append('<option value="">All Tasks</option>');
        $('#school').find('option').remove().end().append('<option value="">All Schools</option>');
        $('#activity').find('option').remove().end().append('<option value="">All Activities</option>');
        $('#status').find('option').remove().end().append('<option value="">All Status</option>');

        taskList = [...new Map(monthlyReportData.map(item => [item.TaskName, item])).values()];
        taskList.forEach((element) => {
            if(element.TaskName !="" && element.TaskName != "undefined"  ){
                $("#projecttask").append("<option>" + element.TaskName + "</option>");
            }
        });

        activityList = [...new Map(monthlyReportData.map(item => [item.ActivityName, item])).values()];
        activityList.forEach((element) =>{
            if(element.ActivityName !="" && element.ActivityName != "undefined"  ){
                $("#activity").append("<option>" + element.ActivityName + "</option>");
            }
        });

        schoolList = [...new Map(monthlyReportData.map(item => [item.SchoolDescription, item])).values()];
        schoolList.forEach((element) => {
            if(element.SchoolDescription !="" && element.SchoolDescription != "undefined"  ){
                $("#school").append("<option>" + element.SchoolDescription + "</option>");
            }
        });
        statusList = [...new Map(monthlyReportData.map(item => [item.Status, item])).values()];
        statusList.forEach((element) => {
            if(element.Status !="" && element.Status != "undefined"  ){
                $("#status").append("<option>" + element.Status + "</option>");
            }
        });

    }
    else {
        $('#projecttask').find('option').remove();
        $('#school').find('option').remove();
        $('#activity').find('option').remove();
        $('#status').find('option').remove();

        let element = monthlyReportData.filter(
            (task) => task.ProjectName === projectName
        );

        $("#projecttask").append('<option value="" selected>All Tasks</option>');
        $("#school").append('<option value="" selected>All Schools</option>');
        $("#activity").append('<option value="" selected>All Activities</option>');
        $("#status").append('<option value="" selected>All Status</option>');

        elements = [...new Map(element.map(item => [item.TaskName, item])).values()];
        elements.forEach((data) =>{
            if(data.TaskName !="" && data.TaskName != "undefined"  ){
                $("#projecttask").append("<option>" + data.TaskName + "</option>");
            }
        });

        elements = [...new Map(element.map(item => [item.ActivityName, item])).values()];
        elements.forEach((data) =>{
            if(data.ActivityName !="" && data.ActivityName != "undefined"  ){
                $("#activity").append("<option>" + data.ActivityName + "</option>");
            }
        });

        elements = [...new Map(element.map(item => [item.SchoolDescription, item])).values()];
        elements.forEach((data) =>{
            if(data.SchoolDescription !="" && data.SchoolDescription != "undefined"  ){
                $("#school").append("<option>" + data.SchoolDescription + "</option>");
            }
        });

        elements = [...new Map(element.map(item => [item.Status, item])).values()];
        elements.forEach((data) =>{
            if(data.Status !="" && data.Status != "undefined"  ){
                $("#status").append("<option>" + data.Status + "</option>");
            }
        });

    }
    projectTask = $("#projecttask").children("option:selected").val();
    school = $("#school").children("option:selected").val();
    activity = $("#activity").children("option:selected").val();
    statusreport = $("#status").children("option:selected").val();
    generateTable();
}

function tableTaskFilter() {
    projectName = $("#projectname").children("option:selected").val();
    projectTask = $("#projecttask").children("option:selected").val();

    if (projectTask === "") {

        $('#school').find('option').remove().end().append('<option value="">All Schools</option>');
        $('#activity').find('option').remove().end().append('<option value="">All Activities</option>');
        $('#status').find('option').remove().end().append('<option value="">All Status</option>');
        let taskelement = monthlyReportData.filter(
            (task) => task.ProjectName === projectName
        );

        activityList = [...new Map(taskelement.map(item => [item.ActivityName, item])).values()];
        activityList.forEach((element) =>{
            if(element.ActivityName !="" && element.ActivityName != "undefined"  ){
                $("#activity").append("<option>" + element.ActivityName + "</option>");
            }
        });

        schoolList = [...new Map(taskelement.map(item => [item.SchoolDescription, item])).values()];
        schoolList.forEach((element) => {
            if(element.SchoolDescription !="" && element.SchoolDescription != "undefined"  ){
                $("#school").append("<option>" + element.SchoolDescription + "</option>");
            }
        });
        statusList = [...new Map(monthlyReportData.map(item => [item.Status, item])).values()];
        statusList.forEach((element) => {
            if(element.Status !="" && element.Status != "undefined"  ){
                $("#status").append("<option>" + element.Status + "</option>");
            }
        });
    }
    else {
        $('#school').find('option').remove();
        $('#activity').find('option').remove();
        $('#status').find('option').remove();
        let taskelement = monthlyReportData.filter(
            (task) => task.TaskName === projectTask
        );
        $("#school").append('<option value="" selected>All Schools</option>');
        $("#activity").append('<option value="" selected>All Activities</option>');
        $("#status").append('<option value="" selected>All Status</option>');

        elements = [...new Map(taskelement.map(item => [item.ActivityName, item])).values()];
        elements.forEach((data) =>{
            if(data.ActivityName !="" && data.ActivityName != "undefined"  ){
                $("#activity").append("<option>" + data.ActivityName + "</option>");
            }
        });

        elements = [...new Map(taskelement.map(item => [item.SchoolDescription, item])).values()];
        elements.forEach((data) =>{
            if(data.SchoolDescription !="" && data.SchoolDescription != "undefined"  ){
                $("#school").append("<option>" + data.SchoolDescription + "</option>");
            }
        });
        elements = [...new Map(taskelement.map(item => [item.Status, item])).values()];
        elements.forEach((data) =>{
            if(data.Status !="" && data.Status != "undefined"  ){
                $("#status").append("<option>" + data.Status + "</option>");
            }
        });
        // taskelement.forEach((elements) => {
        //     $("#school").append("<option>" + elements.SchoolDescription + "</option>");
        //     $("#activity").append("<option>" + elements.ActivityName + "</option>");
        // });
    }

    school = $("#school").children("option:selected").val();
    activity = $("#activity").children("option:selected").val();
    statusreport = $("#status").children("option:selected").val();
    generateTable();

}

function tableFilter() {
    projectName = $("#projectname").children("option:selected").val();
    projectTask = $("#projecttask").children("option:selected").val();
    school = $("#school").children("option:selected").val();
    activity = $("#activity").children("option:selected").val();
    statusreport = $("#status").children("option:selected").val();

    generateTable();

}

function generateTable() {
    let data = monthlyReportData.filter(
        (task) => (projectName === "" || task.ProjectName === projectName)
            && (projectTask === "" || task.TaskName === projectTask)
            && (school === "" || task.SchoolDescription === school)
            && (activity === "" || task.ActivityName === activity) 
            && (statusreport === "" || task.Status === statusreport)
    );
    generateEmployeeReportingTable(data, "employeereportingtable");
}



function dateFilter() {

    let fromDate = $("#fromdate").val();
    let toDate = $("#todate").val();
    const date1 = new Date(fromDate);
    const date2 = new Date(toDate);
    function dateDiffInDays(date1, date2) {
        const perDay= 1000 * 60 * 60 * 24;
        const utc1 = Date.UTC(date1.getFullYear(),date1.getMonth(), date1.getDate());
        const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
      
        return Math.floor((utc2 - utc1) /perDay )+ 1;
    }
    difference = dateDiffInDays(date1,date2);

    let data = date1.setDate(date1.getDate() + 180);
    let Dates = new Date(data).toISOString().split('T')[0];
    // employeeReportingList();
    $("#exampleModalCenter").modal("show");

    $.ajax({
        type: "GET",
        url: httpURL+"/timesheetbookedmonthreport?BusinessPartnerId="+internalID+"&startDate="+fromDate+"&endDate="+toDate,
        dataType: "json",
        // async:false,
        success: function (successdata) {
            monthlyReportData = successdata.MonthlyReport;
            setTimeout(function() {
                $("#exampleModalCenter").modal("hide");
            }, 1000);
            // if(Date.parse(fromDate) > Date.parse(toDate)){
            //         toastr.error("Invalid Date Range", "Warning!",{ timeOut: 2000 });
            //     }
            //     else{
            //         if (difference > 181) {
            //             toastr.error("Please Select End Date Before " + Dates + " ( 180 Days Only ).", "Warning!",{ timeOut: 2000 });
            //         }
            //         else{
                        
            //             
            //         }
            //     }

            generateEmployeeReportingTable(monthlyReportData, "employeereportingtable");

            projectList = [...new Map(monthlyReportData.map(item => [item.ProjectID, item])).values()];
            $('#projectname').find('option').remove().end().append('<option value="">All Projects</option>');           
            projectList.forEach((element) => {
                $("#projectname").append("<option>" + element.ProjectName + "</option>");
            });
            $('#projecttask').find('option').remove().end().append('<option value="">All Tasks</option>');
            $('#school').find('option').remove().end().append('<option value="">All Schools</option>');
            $('#activity').find('option').remove().end().append('<option value="">All Activities</option>');

            taskList = [...new Map(monthlyReportData.map(item => [item.TaskName, item])).values()];
            taskList.forEach((element) => {
                $("#projecttask").append("<option>" + element.TaskName + "</option>");
            });

            activityList = [...new Map(monthlyReportData.map(item => [item.ActivityName, item])).values()];
            activityList.forEach((element) =>{
                $("#activity").append("<option>" + element.ActivityName + "</option>");
            });

            schoolList = [...new Map(monthlyReportData.map(item => [item.SchoolDescription, item])).values()];
            schoolList.forEach((element) => {
                $("#school").append("<option>" + element.SchoolDescription + "</option>");
            });
            statusList = [...new Map(monthlyReportData.map(item => [item.Status, item])).values()];
            statusList.forEach((element) => {
                $("#school").append("<option>" + element.Status + "</option>");
            });
            
            
            
        },
        error: function (response,error,message) {
            setTimeout(function() {
                $("#exampleModalCenter").modal("hide");
            }, 1000);
            toastr.error("Error Occurred While Processing... Please Try Again or Contact Adiministrator", "Error : " +response.status, { timeOut: 4000 });

            // toastr.error("Error Occurred : " +response.responseJSON.body, "Error : " +response.status, { timeout: 1000 });
            // alert("error : " + response.status);
            // console.log(JSON.stringify(response.responseJSON.statusCode));
            // console.log(JSON.stringify(response.responseJSON.body));
        },
        });

}

function  clickTheExcel(){
    $('#employeereportingtable').DataTable().buttons(0,0).trigger();
}

function clickTheAllExcel(){
    $('#employeereportingtable').DataTable().buttons(0,1).trigger();
}

function managerFromDateFilter(){
    let fromDate = $("#fromdate").val();
    let fromdate = new Date(fromDate);
    let data = fromdate.setDate(fromdate.getDate() + 180);
    let endDate = new Date(data).toISOString().split('T')[0];
  
    $('#todate').attr('max', endDate);
    $('#todate').attr('min',fromDate);
}