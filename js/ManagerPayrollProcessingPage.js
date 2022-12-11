let payrollFirstDate;
let payrollLastDate;
let managerPayrollData = [];
let managerPayrollDetailsData=[];
let statusPayrollList=[];
let payrollEmployeeName;
let payrollStatus;
let data = [];
let rowValue =[];
let detailsData=[];
let employeefilter =[];
let managerpayroll = [];
let rowFilter;
let empSAPUUID;
let objectID;
let reportedHours;
let datamodified=false;
let allprojectlist=[];
let count = 0;
let sumofApprovedValues = 0;
// let empID = primaryDetails.EmployeeId; 
// let internalID = primaryDetails.BusinessPartnerId;


function managerPayrollList(){

    $("#exampleModalCenter").modal("show");

    $.ajax({
        type: "GET",
        url: httpURL+"/payrollgenerationprocess?yearandmonth="+$('#selectYear').val()+"-"+$('#selectMonth').val()+"&managerBusinessPartnerId="+internalID,
        dataType: "json",
       // async: false,
        success: function (successdata) {
            managerPayrollData = successdata.PayRollGenerationProcess;
            // console.log("FIRST JSON DATA",managerPayrollData);

            setTimeout(function() {
                $("#exampleModalCenter").modal("hide");
            }, 1000);

            generateManagerPayrollTable(managerPayrollData,'managerpayrolltable');
            
            $('#managerpayrollemployeenames').find('option').remove().end().append('<option value="">All Employees</option>');
            $('#managerpayrollstatus').find('option').remove().end().append('<option value="">All Status</option>');
            
            managerPayrollEmployeeNameData = [...new Map(managerPayrollData.map(item => [item.EmployeeID, item])).values()];
            managerPayrollEmployeeNameData.forEach((element) => {
                if(element.EmployeeName != "" && element.EmployeeName != undefined  ){
                    $("#managerpayrollemployeenames").append("<option>" + element.EmployeeName + "</option>");
                }
            });
            
            statusPayrollList = [...new Map(managerPayrollData.map(item => [item.Status, item])).values()];
            statusPayrollList.forEach((element) => {
                if(element.EmployeeName != "" && element.EmployeeName != undefined  ){
                    $("#managerpayrollstatus").append("<option>" + element.Status + "</option>");
                }
            });
        },
        error: function (response,error,message) {
            toastr.error("Error Occurred While Processing... Please Try Again or Contact Adiministrator", "Error : " +response.status, { timeOut: 4000 });
            setTimeout(function() {
                $("#exampleModalCenter").modal("hide");
            }, 1000);
            // toastr.error("Error Occurred : " +response.responseJSON.body, "Error : " +response.status, { timeout: 1000 });
            // alert("error : " + response.status);
            // console.log(JSON.stringify(response.responseJSON.statusCode));
            // console.log(JSON.stringify(response.responseJSON.body));
        }
    });
    
}

function payrollEmployeeFilter(){
    if(datamodified == false && count == 0){
        payrollEmployeeName =$("#managerpayrollemployeenames").children("option:selected").val();

        if(payrollEmployeeName === ""){
            $('#managerpayrollstatus').find('option').remove().end().append('<option value="">All Status</option>');
            statusPayrollList = [...new Map(managerPayrollData.map(item => [item.Status, item])).values()];
            statusPayrollList.forEach((element) => {
                if(element.Status != "" && element.Status != undefined  ){
                    $("#managerpayrollstatus").append("<option>" + element.Status + "</option>");
                }
            });
        }
        else{
            $('#managerpayrollstatus').find('option').remove();
    
            let element = managerPayrollData.filter(
                (task) => task.EmployeeName === payrollEmployeeName
            );
            
            $('#managerpayrollstatus').append('<option value="">All Status</option>');
    
            statusPayrollList = [...new Map(element.map(item => [item.Status, item])).values()];
            statusPayrollList.forEach((element) => {
                if(element.Status != "" && element.Status != undefined  ){
                    $("#managerpayrollstatus").append("<option>" + element.Status + "</option>");
                }
            });
    
    
        }
        payrollStatus = $("#managerpayrollstatus").children("option:selected").val();
        generatePayrollTable();
    }
    else{
        toastr.error("Please save your changes before proceeding further", { timeOut: 2500 });
    }
   
}

function payrollManagerTableFilter(){
    if(datamodified == false && count == 0){
        payrollEmployeeName =$("#managerpayrollemployeenames").children("option:selected").val();
        payrollStatus = $("#managerpayrollstatus").children("option:selected").val();

        generatePayrollTable();
    }
    else{
        toastr.error("Please save your changes before proceeding further", { timeOut: 2500 });
    }
}
function generatePayrollTable(){
  
    let data = managerPayrollData.filter(
        (task) => (payrollEmployeeName === "" || task.EmployeeName === payrollEmployeeName) 
        && (payrollStatus === "" || task.Status === payrollStatus)
    );
    // console.log("FILTERED JSON DATA",data);
    hidetable();
    generateManagerPayrollTable(data,"managerpayrolltable");
}


function tableSelect(payrollTable,tableName){
        $("#"+tableName).on("click","tbody tr",function(){
            if(datamodified == false && count == 0){
                $(this).addClass("selectedrow").siblings().removeClass("selectedrow");
               

                let ctrl = $(this).find("td:eq(3) input[type='button']");
                if(ctrl.attr('data-status') == "Draft"){
                    $('#sumofHours').show();
                    $('#addRow').show();
                    $('#save').show(); 
                }
                else{
                    $('#sumofHours').hide();
                    $('#addRow').hide();
                    $('#save').hide();
                }

                empSAPUUID = ctrl.attr('data-sapuuid');
                objectID = ctrl.attr('data-objectid');
                reportedHours = ctrl.attr('data-reportedHours');
                employeefilter = managerPayrollData.filter(
                    (task) => task.SAPUUID === ctrl.attr('data-sapuuid')
                );
                // console.log(employeefilter);
                if( employeefilter.length >0){
                    $('#totalReportedHours').val(Number(reportedHours).toFixed(2));
                    $('#managerpayrolldetailstable').show();
                    data = employeefilter[0].Details;
                    generateManagerPayrollDetailsTable(data,'managerpayrolldetailstable',ctrl.attr('data-status'));   
                }
                           

            }
            else{
                toastr.error("Please save your changes before proceeding further", { timeOut: 2500 });
            }
    });
}

function AddRow() {   
// $("#exampleModalCenter").modal("show");

$.ajax({
    type: "GET",
    url: httpURL+"/projectsToManager",
    dataType: "json",
    // async: false,
    success: function (successdata) {
    allprojectlist = successdata.ProjectTaskListsToManager;
    console.log(allprojectlist);

        // setTimeout(function() {
        //     $("#exampleModalCenter").modal("hide");
        // }, 1000);
        var rowIndex = $('#managerpayrolldetailstable tr').length;
        $('#managerpayrolldetailstable').append(
            '<tr><td></td>' +'<td><select class="form-control-sm select2 typeval" onchange="showproject(this)" disabled><option value="Actual Hours Worked" selected>Actual Hours Worked</option><option value="Absence">Absence</option><option value="Vacation">Vacation</option></select>' 
            +'</td><td></td>' +'<td><select class="form-control-sm select2 dynamicProjects" id='+rowIndex +' ><option value="0">All Projects</option></select>' 
            +'</td><td></td><td></td>' +
            '<td><input type="number" style="font-size:80%;" class="approvehours changed" data-id="" data-sapuuid='+ empSAPUUID+'data-projectid="" onblur="addingvalues()" value="0.0"><button type="button" class="btn btn-sm btn-outline-danger ml-1 deleterowbutton" style="font-size=80%;" onclick="deleteRow(this)"><i class="fas fa-solid fa-trash"></i></button>' +'</td></tr>').clone(false);

            $('.select2').select2(
                {
                    dropdownAutoWidth: true,
                    width:'100%'
                },
            );
        let value = document.getElementById(rowIndex);
        var ctrl = $('#managerpayrolldetailstable tbody').closest('tr').find('.dynamicProjects');
        //let projectData =  [...new Map(data.map(item => [item.ProjectID, item])).values()];
        for (let i = 0; i <= allprojectlist.length; i++) {
            let optionValue = document.createElement("OPTION");
            optionValue.innerHTML = allprojectlist[i].ProjectListDetails;
            optionValue.value = allprojectlist[i].ProjectId;
            
            value.options.add(optionValue);
            // alert(allprojectlist[i].ProjectId);
            //     ctrl.append(`<option value="${allprojectlist[i].ProjectId}">${allprojectlist[i].ProjectListDetails}</option>`);
        }
    },
    error:function (response,error,message) {
        toastr.error("Error Occurred While Processing... Please Try Again or Contact Adiministrator", "Error : " +response.status, { timeOut: 1000 });
        setTimeout(function() {
            $("#exampleModalCenter").modal("hide");
        }, 1000);
        // toastr.error("Error Occurred : " +response.responseJSON.body, "Error : " +response.status, { timeout: 1000 });
    }
});

count++;
// alert(count);
// $('.dynamicProjects').hide();
}

function addingvalues(event){
    sumofApprovedValues = 0;
    $('#managerpayrolldetailstable tbody tr').each(function(){
        // console.log();
        sumofApprovedValues += parseFloat($(this).find('.changed').val());
        
    });
   console.log(sumofApprovedValues);
   $("#sumofapproved").val(sumofApprovedValues);
}
//Delete Button Function in Add Row
function deleteRow(event){
    $(event).closest('tr').remove();
    count--;
    // alert(count);

}

function insideTable(TableName,detailsTable){
    detailsTable.destroy();
    function format(detailsData){
        // console.log(detailsData);
        var ChildTable='<div class="table-responsive">'+
        '<table id="managerpayrolltaskdetailstable" cellspacing="0" width="50%" style="border-bottom:1px solid grey;margin-left:25%;"> '+
        '<thead class="bg-light"><tr><th style="width:50%">Task</th><th style="width:50%">Reported Hours</th></tr></thead>'+
        '<tbody>';
        for(i=0;i<detailsData.length;i++){
            ChildTable += '<tr ><td>'+detailsData[i].TaskName+'</td><td>'+Number(detailsData[i].ReportedHours).toFixed(2)+'</td></tr>';
        }
        ChildTable +='</tbody></table></div>';
        return ChildTable;
        // return '<div class="table-responsive">'+
        // '<table id="managerpayrolltaskdetailstable" cellspacing="0" width="50%" style="font-size:12px;"> '+
        // '<thead><tr><th>Task</th><th>Reported Hours</th></tr></thead>'+
        // '<tbody><tr ><td>'+detailsData[0].TaskName+'</td><td>'+detailsData[0].ReportedHours+'</td></tr>'+
        // '<tr ><td>'+detailsData[1].TaskName+'</td><td>'+detailsData[1].ReportedHours+'</td></tr></tbody></table>'+
        // '</div>';
    }
    $('#'+TableName).on('click', 'tbody tr td.details-control', function () {
        var tr = $(this).closest('tr');
        $(this).addClass("selected").siblings().removeClass("selected");
        var row = detailsTable.row(tr);

        rowValue =detailsTable.row(this).data();

        if(rowValue != undefined){
            detailsfilter = data.filter(
                (task) => task.ProjectID === rowValue.ProjectID
            );

            detailsData = detailsfilter[0].TaskDetails; 
            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            } else {
                
                // Open this row
                row.child(format(detailsData)).show();
            // row.child(format(tr.data('child-value'))).show();
                tr.addClass('shown');
                
            //  generateManagerPayrollTaskDetailsTable(detailsData,'managerpayrolltaskdetailstable');

            }
        }
       
    } );
}

function hidetable(){
    $('#managerpayrolldetailstable').hide();
    $('#sumofHours').hide();
    $('#addRow').hide();
    $('#save').hide();
}

function showproject(event){
    let ctrl = $(event).closest('tr').find('.dynamicProjects');
    if(event.value == 'Vacation' || event.value == 'Absence' ){
        $(ctrl).prop('disabled', true);
    }
    else{
        $(ctrl).prop('disabled', false);
    }
}

function inputchanged(event){
    if(!$("#save").is(":hidden")){
          $(event).attr('data-changed','true');   
        datamodified=true;
    }
   
}

function saveData(){

    
    let sumofapprovedhours =0;
    let ctrl;
    let rootProjectJson ={
        ROOT_SAP_UUID:empSAPUUID,
        ObjectID:objectID,
        Operation:"Update",
        Project : []
    };
    let saveJson =[];
    $("#managerpayrolldetailstable tbody tr").each(function (event) {
        ctrl = $(this).find("td:eq(6) input[type='number']");
        if($(this).find('.dynamicProjects').val()=='0'){
            toastr.error("Please Fill the Project details", { timeOut: 3000 });
            flag = 1
            return false;
        }
        else{
            flag=0;
        }
    })
    if(flag == 0){

        $("#managerpayrolldetailstable tbody tr").each(function (event) {

                ctrl = $(this).find("td:eq(6) input[type='number']");
                // console.log($(this).find('.changed').val());
                if($(this).find('.changed').val() != undefined)
                {   
                    sumofapprovedhours += parseFloat($(this).find('.changed').val() == "" ? "0" : $(this).find('.changed').val() );
                }
            if(ctrl.attr('data-changed') === 'true' || count>0){   
                //  console.log($(this).find('.changed').val());
                    // console.log(ctrl.attr('data-id'));
                    // console.log(ctrl.attr('data-changed'));
                    // console.log(ctrl.attr('data-projectid'));
                    // console.log($(this).closest("tr")[0].cells[2].innerHTML);
                
                if(ctrl.attr('data-id'))
                {
                    saveJson={
                        "PROJECT_SAP_UUID": ctrl.attr('data-id'),
                        "TypeofHours":$(this).closest("tr")[0].cells[1].innerHTML,
                        "ProjectId":ctrl.attr('data-projectid'),  
                        "ProjectName":$(this).closest("tr")[0].cells[2].innerHTML,
                        "ApprovedHours":$(this).find('.changed').val()
                    },
                    rootProjectJson.Project.push(saveJson);
                }
                else{
                        if($(this).find('.typeval').val()==="Actual Hours Worked")
                        {
                            let splittedprojectname =($(this).find('.dynamicProjects option:selected').text()).split('|');
                            let trimmedprojectname = splittedprojectname[1].trim();
                            saveJson={
                                "PROJECT_SAP_UUID": "",
                                "TypeofHours":$(this).find('.typeval').val(),
                                "ProjectId":$(this).find('.dynamicProjects').val(),  
                                "ProjectName":trimmedprojectname,
                                "ApprovedHours":$(this).find('.changed').val()
                            },
                        rootProjectJson.Project.push(saveJson);
                        }
                        else
                        {
                            saveJson={
                                "PROJECT_SAP_UUID": "",
                                "TypeofHours":$(this).find('.typeval').val(),
                                "ProjectId":"",  
                                "ProjectName":"",
                                "ApprovedHours":$(this).find('.changed').val()
                            },
                        rootProjectJson.Project.push(saveJson);
                        }

                    }
                    
            }
            
        });
        // console.log(sumofapprovedhours);
        // alert(JSON.stringify(saveJson));
        // console.log(rootProjectJson);
        if(reportedHours == sumofapprovedhours){
            datamodified = false;
            count = 0;
            $("#exampleModalCenter").modal("show");


            $.ajax({
                type: "POST",
                url: httpURL+"/payrollgenerationprocess",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(rootProjectJson),
                success: function(response) {
                    responseValue = response.ManagerUpdateAndCreate;
                // console.log(responseValue);
                    setTimeout(function() {
                        $("#exampleModalCenter").modal("hide");
                    }, 1000);

                    $('#managerpayrolldetailstable tbody tr').each(function(event){
                        $(this).find(".deleterowbutton").hide();
                    });

                    const newArr = managerPayrollData.map(object => {
                        if (object.SAPUUID === responseValue[0].SAPUUID) {
                        // 👇️ change value of name property
                        return {...object, Details: responseValue[0].Details};
                        }
                        return object;
                    });
                    managerPayrollData=newArr;
                    toastr.success("Updated and Added successfully", "Done!", { timeOut: 4000 });

                },
                error: function (response,error,message) {
                    toastr.error("Error Occurred in While Processing... Please Try Again or Contact Adiministrator", "Error : " +response.status, { timeOut: 3000 });
                    setTimeout(function() {
                        $("#exampleModalCenter").modal("hide");
                    }, 1000);
                },
            });

        }
        else {
            toastr.error("Total Approved Hours is not equivalent to Total Reported Hours", "Error",{ timeOut: 3000 });
        }
    }
}
    
function approveData(event){
        let approveJson = [];
        approveJson = 
            {
                Operation: "Approve",
                ROOT_SAP_UUID: $(event).attr('data-sapuuid'),
                ObjectID:$(event).attr('data-objectid')
            }
        //let ctrl = $("#managerpayrolldetailstable tbody tr").find("td:eq(5) input[type='number']");
            if(datamodified == false && count == 0){
                datamodified=false;

                $("#exampleModalCenter").modal("show");

                $.ajax({
                    type: "POST",
                    url: httpURL+"/payrollgenerationprocess",
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(approveJson),
                    // async:false,
                    success: function(response) {
                        setTimeout(function() {
                            $("#exampleModalCenter").modal("hide");
                        }, 1000);
                        $(event).closest('tr').find('.buttonstatus').text('Approved');
                        $(event).closest('tr').find('.approved').hide();
                        $(event).closest('tr').find('.approved').attr('data-status','Approved');
                
                        const newArr = managerPayrollData.map(object => {
                            if (object.SAPUUID === $(event).attr('data-sapuuid')) {
                              // 👇️ change value of name property
                              return {...object,  Status: "Approved"};
                            }
                           
                            return object;
                          });
                          managerPayrollData = newArr;
                        toastr.success("Approved successfully", "Done!", { timeOut: 4000 });

                        $('#addRow').hide();
                        $('#save').hide();
                    },
                    error: function (response,error,message) {
                        toastr.error("Error Occurred While Processing... Please Try Again or contact Adiministrator", "Error : " +response.status, { timeOut: 3000 });
                        setTimeout(function() {
                            $("#exampleModalCenter").modal("hide");
                        }, 1000);
                    },
                });
            }
            // else{
            //     toastr.error("Please save the record before approve", "Error", { timeOut: 3000 });
            // }           

}

function monthyearchange(){
    if(datamodified == false && count == 0){
        managerPayrollList();  
        hidetable();
    }
    else{
        toastr.error("Please save your changes before proceeding further", { timeOut: 2500 });
    }
    
}