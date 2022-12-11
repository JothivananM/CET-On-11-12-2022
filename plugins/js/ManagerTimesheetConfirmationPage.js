let managerTimesheetdata = [];
let managerEmployeeNameData = [];
let managerProjectList = [];
let managerTaskList = [];
let managerActivityList = [];
let managerSchoolList = [];
let managerStatusList = [];
let statusFilteredList = [];
let tasknames = [];
let tasknamelist = [];
let employeeName;
let managerProjectName;
let managerProjectTask;
let managerActivity;
let managerSchool;
let allstatus;
let firstDates;
let lastDates;
let objectId;
let responseValue = [];

// let empID = primaryDetails.EmployeeId; 
// let internalID = primaryDetails.BusinessPartnerId;


function setDates() {
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    firstDates = new Date(firstDay).toISOString().split('T')[0];
    lastDates = new Date(lastDay).toISOString().split('T')[0];

    $('#managerfromdate').val(firstDates);
    $('#managertodate').val(lastDates);
}

function managerTimesheetConfirmation() {
    setDates();
    $("#exampleModalCenter").modal("show");

    $.ajax({
        type: "GET",
        url:httpURL+"/directmanagertimesheetapproval?startDate="+firstDates+"&endDate="+lastDates+"&managerBusinessPartnerId="+internalID,
        //https://lj8f09lng9.execute-api.eu-central-1.amazonaws.com/Prod/directmanagertimesheetapproval?startDate=2022-01-01&endDate=2022-12-31&managerId=8000002006
        // url: "https://lj8f09lng9.execute-api.eu-central-1.amazonaws.com/Prod/directmanagertimesheetapproval?startDate=&endDate=&managerId=ZDirectManager_SDK",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        // async: false,
        success: function (successdata) {
           
            managerTimesheetdata = successdata.EmployeeListReport;
            setTimeout(function() {
                $("#exampleModalCenter").modal("hide");
            }, 1000);

            generateManagerConfimationTable(managerTimesheetdata, "managerconfirmationtable");
        },
        error: function (response,error,message) {
            toastr.error("Error Occurred While Processing... Please Try Again or Contact Adiministrator", "Error : " +response.status, { timeOut: 1000 });

            setTimeout(function() {
                $("#exampleModalCenter").modal("hide");
            }, 1000);
            // toastr.error("Error Occurred : " +response.responseJSON.body, "Error : " +response.status, { timeout: 1000 });
            
        },
    });

    managerEmployeeNameData = [...new Map(managerTimesheetdata.map(item => [item.EmployeeID, item])).values()];
    managerEmployeeNameData.forEach((element) => {
        if(element.EmployeeName != "" && element.EmployeeName != undefined  ){
            $("#employeenames").append("<option>" + element.EmployeeName + "</option>");
        }
        
    });

    managerProjectList = [...new Map(managerTimesheetdata.map(item => [item.ProjectID, item])).values()];
    managerProjectList.forEach((element) => {
        if(element.ProjectName !="" && element.ProjectName != undefined  ){
            $("#managerprojectname").append("<option>" + element.ProjectName + "</option>");
        }
    });

    managerTaskList = [...new Map(managerTimesheetdata.map(item => [item.TaskName, item])).values()];
    managerTaskList.forEach((element) => {
        if(element.TaskName !="" && element.TaskName != undefined  ){
            $("#managerprojecttask").append("<option>" + element.TaskName + "</option>");
        }
    });

    managerActivityList = [...new Map(managerTimesheetdata.map(item => [item.ActivityName, item])).values()];
    managerActivityList.forEach((element) => {
        if(element.ActivityName !="" && element.ActivityName != undefined  && element.ActivityName != " " ){
            $("#manageractivity").append("<option>" + element.ActivityName + "</option>");
        }
    });

    managerSchoolList = [...new Map(managerTimesheetdata.map(item => [item.SchoolDescription, item])).values()];
    managerSchoolList.forEach((element) => {
        if(element.SchoolDescription !="" && element.SchoolDescription != undefined  ){
            $("#managerschool").append("<option>" + element.SchoolDescription + "</option>");
        }
    });

    managerStatusList = [...new Map(managerTimesheetdata.map(item => [item.Status, item])).values()];
    managerStatusList.forEach((element) => {
        if(element.Status !="" && element.Status != undefined  ){
            $("#managerstatus").append("<option>" + element.Status + "</option>");
        }
    });

}

function managertableEmployeeFilter() {
    employeeName = $("#employeenames").children("option:selected").val();

    if (employeeName === "") {
        $('#managerprojectname').find('option').remove().end().append('<option value="">All Projects</option>');
        $('#managerprojecttask').find('option').remove().end().append('<option value="">All Tasks</option>');
        $('#managerschool').find('option').remove().end().append('<option value="">All Schools</option>');
        $('#manageractivity').find('option').remove().end().append('<option value="">All Activities</option>');
        $('#managerstatus').find('option').remove().end().append('<option value="">All Status</option>');

        managerProjectList.forEach((element) => {
            if(element.ProjectName !="" && element.ProjectName != undefined  ){
                $("#managerprojectname").append("<option>" + element.ProjectName + "</option>");
            }
        });

        managerTaskList = [...new Map(managerTimesheetdata.map(item => [item.TaskName, item])).values()];
        managerTaskList.forEach((element) => {
            if(element.TaskName !="" && element.TaskName != undefined  ){
                $("#managerprojecttask").append("<option>" + element.TaskName + "</option>");
            }
        });

        managerActivityList = [...new Map(managerTimesheetdata.map(item => [item.ActivityName, item])).values()];
        managerActivityList.forEach((element) => {
            if(element.ActivityName !="" && element.ActivityName != undefined  ){
                $("#manageractivity").append("<option>" + element.ActivityName + "</option>");
            }
        });

        managerSchoolList = [...new Map(managerTimesheetdata.map(item => [item.SchoolDescription, item])).values()];
        managerSchoolList.forEach((element) => {
            if(element.SchoolDescription !="" && element.SchoolDescription != undefined  ){
                $("#managerschool").append("<option>" + element.SchoolDescription + "</option>");
            }
        });

        managerStatusList.forEach((element) => {
            if(element.Status !="" && element.Status != undefined  ){
              $("#managerstatus").append("<option>" + element.Status + "</option>");
            }
        });
    }
    else {
        $('#managerprojectname').find('option').remove();
        $('#managerprojecttask').find('option').remove();
        $('#managerschool').find('option').remove();
        $('#manageractivity').find('option').remove();
        $('#managerstatus').find('option').remove();

        let elements = managerTimesheetdata.filter(
            (task) => task.EmployeeName === employeeName
        );



        $('#managerprojectname').append('<option value="">All Projects</option>');
        $('#managerprojecttask').append('<option value="">All Tasks</option>');
        $('#managerschool').append('<option value="">All Schools</option>');
        $('#manageractivity').append('<option value="">All Activities</option>');
        $('#managerstatus').append('<option value="">All Status</option>');

        managerProjectList = [...new Map(elements.map(item => [item.ProjectID, item])).values()];
        managerProjectList.forEach((element) => {
            if(element.ProjectName !="" && element.ProjectName != undefined  ){
                $("#managerprojectname").append("<option>" + element.ProjectName + "</option>");
            }
        });

        managerTaskList = [...new Map(elements.map(item => [item.TaskName, item])).values()];
        managerTaskList.forEach((element) => {
            if(element.TaskName !="" && element.TaskName != undefined  ){
                $("#managerprojecttask").append("<option>" + element.TaskName + "</option>");
            }
        });

        managerActivityList = [...new Map(elements.map(item => [item.ActivityName, item])).values()];
        managerActivityList.forEach((element) => {
            if(element.ActivityName !="" && element.ActivityName != undefined  ){
                $("#manageractivity").append("<option>" + element.ActivityName + "</option>");
            }
        });

        managerSchoolList = [...new Map(elements.map(item => [item.SchoolDescription, item])).values()];
        managerSchoolList.forEach((element) => {
            if(element.SchoolDescription !="" && element.SchoolDescription != undefined  ){
                $("#managerschool").append("<option>" + element.SchoolDescription + "</option>");
            }
        });

        managerStatusList = [...new Map(elements.map(item => [item.Status, item])).values()];
        managerStatusList.forEach((element) => {
            if(element.Status !="" && element.Status != undefined  ){
                $("#managerstatus").append("<option>" + element.Status + "</option>");
            }
        });


    }
    managerProjectName = $("#managerprojectname").children("option:selected").val();
    managerProjectTask = $("#managerprojecttask").children("option:selected").val();
    managerSchool = $("#managerschool").children("option:selected").val();
    managerActivity = $("#manageractivity").children("option:selected").val();
    allstatus = $("#managerstatus").children("option:selected").val();
    generateManagerTable();
}

function managertableProjectFilter() {
    employeeName = $("#employeenames").children("option:selected").val();
    managerProjectName = $("#managerprojectname").children("option:selected").val();

    if (managerProjectName === "") {
        $('#managerprojectname').find('option').remove().end().append('<option value="">All Projects</option>');
        $('#managerprojecttask').find('option').remove().end().append('<option value="">All Tasks</option>');
        $('#managerschool').find('option').remove().end().append('<option value="">All Schools</option>');
        $('#manageractivity').find('option').remove().end().append('<option value="">All Activities</option>');
        $('#managerstatus').find('option').remove().end().append('<option value="">All Status</option>');


        let elementEmployee = managerTimesheetdata.filter(
            (task) => task.EmployeeName === employeeName
        );
        managerProjectList = [...new Map(elementEmployee.map(item => [item.ProjectID, item])).values()];
        managerProjectList.forEach((element) => {
            if(element.ProjectName !="" && element.ProjectName != undefined  ){
                $("#managerprojectname").append("<option>" + element.ProjectName + "</option>");
            }
        });

        managerTaskList = [...new Map(elementEmployee.map(item => [item.TaskName, item])).values()];
        managerTaskList.forEach((element) => {
            if(element.TaskName !="" && element.TaskName != undefined  ){
                $("#managerprojecttask").append("<option>" + element.TaskName + "</option>");
            }
            });

        managerActivityList = [...new Map(elementEmployee.map(item => [item.ActivityName, item])).values()];
        managerActivityList.forEach((element) => {
            if(element.ActivityName !="" && element.ActivityName != undefined  ){
                $("#manageractivity").append("<option>" + element.ActivityName + "</option>");
            }
            });

        managerSchoolList = [...new Map(elementEmployee.map(item => [item.SchoolDescription, item])).values()];
        managerSchoolList.forEach((element) => {
            if(element.SchoolDescription !="" && element.SchoolDescription != undefined  ){
                $("#managerschool").append("<option>" + element.SchoolDescription + "</option>");
            }
            });

        managerStatusList = [...new Map(elementEmployee.map(item => [item.Status, item])).values()];
        managerStatusList.forEach((element) => {
            if(element.Status !="" && element.Status != undefined  ){
                $("#managerstatus").append("<option>" + element.Status + "</option>");
            }
            });
    }
    else {
        $('#managerprojecttask').find('option').remove();
        $('#managerschool').find('option').remove();
        $('#manageractivity').find('option').remove();
        $('#managerstatus').find('option').remove();

        let element = managerTimesheetdata.filter(
            (task) => task.EmployeeName === employeeName
        );

        let elementEmployee = element.filter(
            (task) => task.ProjectName === managerProjectName

        );


        $("#managerprojecttask").append('<option value="" selected>All Tasks</option>');
        $("#managerschool").append('<option value="" selected>All Schools</option>');
        $("#manageractivity").append('<option value="" selected>All Activities</option>');
        $("#managerstatus").append('<option value="" selected>All Status</option>');

        managerTaskList = [...new Map(elementEmployee.map(item => [item.TaskName, item])).values()];
        managerTaskList.forEach((elements) => {
            if(elements.TaskName !="" && elements.TaskName != undefined  ){
                $("#managerprojecttask").append("<option>" + elements.TaskName + "</option>");
            }    
        });

        managerActivityList = [...new Map(elementEmployee.map(item => [item.ActivityName, item])).values()];
        managerActivityList.forEach((elements) => {
            if(elements.ActivityName !="" && elements.ActivityName != undefined  ){
                $("#manageractivity").append("<option>" + elements.ActivityName + "</option>");
            }    
        });

        managerSchoolList = [...new Map(elementEmployee.map(item => [item.SchoolDescription, item])).values()];
        managerSchoolList.forEach((elements) => {
            if(elements.SchoolDescription !="" && elements.SchoolDescription != undefined  ){
                $("#managerschool").append("<option>" + elements.SchoolDescription + "</option>");
            }    
        });

        managerStatusList = [...new Map(elementEmployee.map(item => [item.Status, item])).values()];
        managerStatusList.forEach((elements) => {
            if(elements.Status !="" && elements.Status != undefined  ){
                $("#managerstatus").append("<option>" + elements.Status + "</option>");
            }    
        });
    }
    managerProjectTask = $("#managerprojecttask").children("option:selected").val();
    managerSchool = $("#managerschool").children("option:selected").val();
    managerActivity = $("#manageractivity").children("option:selected").val();
    allstatus = $("#managerstatus").children("option:selected").val();
    generateManagerTable();
}

function managertableTaskFilter() {
    managerProjectName = $("#managerprojectname").children("option:selected").val();
    managerProjectTask = $("#managerprojecttask").children("option:selected").val();

    if (managerProjectTask === "") {
        let elementTask = managerTimesheetdata.filter(
            (task) => task.ProjectName === managerProjectName
        );
        $('#managerschool').find('option').remove().end().append('<option value="">All Schools</option>');
        $('#manageractivity').find('option').remove().end().append('<option value="">All Activities</option>');
        $('#managerstatus').find('option').remove().end().append('<option value="">All Status</option>');

        managerActivityList = [...new Map(elementTask.map(item => [item.ActivityName, item])).values()];
        managerActivityList.forEach((element) => {
            if(element.ActivityName !="" && element.ActivityName != undefined  ){
                $("#manageractivity").append("<option>" + element.ActivityName + "</option>");
            }
        });

        managerSchoolList = [...new Map(elementTask.map(item => [item.SchoolDescription, item])).values()];
        managerSchoolList.forEach((element) => {
            if(element.SchoolDescription !="" && element.SchoolDescription != undefined  ){
                $("#managerschool").append("<option>" + element.SchoolDescription + "</option>");
            }
        });

        managerStatusList = [...new Map(elementTask.map(item => [item.Status, item])).values()];
        managerStatusList.forEach((element) => {
            if(element.Status !="" && element.Status != undefined  ){
                $("#managerstatus").append("<option>" + element.Status + "</option>");
            }
        });
    }
    else {
        $('#managerschool').find('option').remove();
        $('#manageractivity').find('option').remove();
        $('#managerstatus').find('option').remove();

        let taskelement = managerTimesheetdata.filter(
            (task) => task.TaskName === managerProjectTask
        );


        $("#managerschool").append('<option value="" selected>All Schools</option>');
        $("#manageractivity").append('<option value="" selected>All Activities</option>');
        $("#managerstatus").append('<option value="" selected>All Status</option>');

        managerActivityList = [...new Map(taskelement.map(item => [item.ActivityName, item])).values()];
        managerActivityList.forEach((element) => {
            if(element.ActivityName !="" && element.ActivityName != undefined  ){
                $("#manageractivity").append("<option>" + element.ActivityName + "</option>");
            }
        });

        managerSchoolList = [...new Map(taskelement.map(item => [item.SchoolDescription, item])).values()];
        managerSchoolList.forEach((element) => {
            if(element.SchoolDescription !="" && element.SchoolDescription != undefined  ){
                $("#managerschool").append("<option>" + element.SchoolDescription + "</option>");
            }
        });

        managerStatusList = [...new Map(taskelement.map(item => [item.Status, item])).values()];
        managerStatusList.forEach((element) => {
            if(element.Status !="" && element.Status != undefined  ){
                $("#managerstatus").append("<option>" + element.Status + "</option>");
            }
        });
    }

    managerSchool = $("#managerschool").children("option:selected").val();
    managerActivity = $("#manageractivity").children("option:selected").val();
    allstatus = $("#managerstatus").children("option:selected").val();
    generateManagerTable();
}

function managerTableFilter() {
    employeeName = $("#employeenames").children("option:selected").val();
    managerProjectName = $("#managerprojectname").children("option:selected").val();
    managerProjectTask = $("#managerprojecttask").children("option:selected").val();
    managerSchool = $("#managerschool").children("option:selected").val();
    managerActivity = $("#manageractivity").children("option:selected").val();
    allstatus = $("#managerstatus").children("option:selected").val();

    generateManagerTable();
}

function generateManagerTable() {

    let data = managerTimesheetdata.filter(
        (task) => (employeeName === "" || task.EmployeeName === employeeName)
            && (managerProjectName === "" || task.ProjectName === managerProjectName)
            && (managerProjectTask === "" || task.TaskName === managerProjectTask)
            && (managerSchool === "" || task.SchoolDescription === managerSchool)
            && (managerActivity === "" || task.ActivityName === managerActivity)
            && (allstatus === "" || task.Status === allstatus)
    );
    generateManagerConfimationTable(data, "managerconfirmationtable");
}

function confirmSelectedList() {
    let confirmedJson = [];
    let count = 0;
    $("#managerconfirmationtable tr").each(function () {
        var ctrl = $(this).find("td:eq(0) input[type='checkbox']");
        // console.log(ctrl.data('id'));
        if (ctrl.prop("checked")) {
            // console.log(ctrl.data('id'));
            // let empid = $(this).closest("tr")[0].cells[10].innerHTML;

            confirmedJson[count] = {
                EmployeeItemUUID: ctrl.data('id'),
                RejectionRemarks: "",
                Status: "Confirmed",
            }
            count++;
        }
    });

    



    if (count > 0) {

        $("#exampleModalCenter").modal("show");

        $.ajax({
            type: "PUT",
            url: httpURL+"/directmanagertimesheetapproval",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(confirmedJson),
            success: function (response) {
                responseValue = response;

                setTimeout(function() {
                    $("#exampleModalCenter").modal("hide");
                }, 1000);
    
                $("#managerconfirmationtable tr").each(function () {
                    var ctrl = $(this).find("td:eq(0) input[type='checkbox']");
                    if (ctrl.prop("checked")) {
                        $(this).closest("tr")[0].cells[13].innerHTML = "Confirmed";
                        const newArr = managerTimesheetdata.map(object => {
                            if (object.EmployeeItemUUID === ctrl.attr('data-id')) {
                              // 👇️ change value of name property
                              return {...object,  Status: "Confirmed"};
                            }
                           
                            return object;
                          });
                          managerTimesheetdata = newArr;
                        ctrl.prop("checked", false);
                        ctrl.attr("disabled", true);
                    }
            });
                

                toastr.success("Confirmed successfully", "Done!", { timeOut: 1500 });
                $("input:checkbox").prop("checked", false);
                
            },
            error: function (response,error,message) {
                toastr.error("Error Occurred While Processing... Please Try Again or Contact Adiministrator", "Error : " +response.status, { timeOut: 3000 });

                $("input:checkbox").prop("checked", false);
                setTimeout(function() {
                    $("#exampleModalCenter").modal("hide");
                }, 1000);
                // alert("error : " + response.status);
                // console.log(JSON.stringify(response.responseJSON.statusCode));
                // console.log(JSON.stringify(response.responseJSON.body));
            },
        });
    }
    else {
        toastr.warning('Please select atleast 1 record', "Warning!",{ timeOut: 2000 });
    }

}

function modalReject() {
    let count = 0;
    $("#managerconfirmationtable tr").each(function () {
        var ctrl = $(this).find("td:eq(0) input[type='checkbox']");
        if (ctrl.prop("checked")) {
            count = 1;
            $('#modal-default').modal('show');
        }
    });
    if (count == 0) {
        toastr.warning('Please select atleast 1 record', "Warning!",{ timeOut: 2000 });
    }
}

function rejectSelectedList() {
    let rejectedJson = [];
    var rejectionValue = document.getElementById("rejectionRemarks");

    if ($.trim(rejectionValue.value) == '') {
        toastr.warning("Rejection Remarks Required !!!", "Warning!", { timeOut: 2000 });
        return false;
    } else {
        
        $('#modal-default').modal('hide');
        let count = 0;
        $("#managerconfirmationtable tr").each(function () {
            var ctrl = $(this).find("td:eq(0) input[type='checkbox']");
            if (ctrl.prop("checked")) {
                // let empid = $(this).closest("tr")[0].cells[10].innerHTML;

                rejectedJson[count] = {
                    EmployeeItemUUID: ctrl.data('id'),
                    RejectionRemarks: $('#rejectionRemarks').val(),
                    Status: "Rejected",
                }
                count++;
            }
        });

        if (count > 0) {
            let ctrl = [];

            $("#exampleModalCenter").modal("show");

            $.ajax({
                type: "PUT",
                url: httpURL+"/directmanagertimesheetapproval",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(rejectedJson),
                success: function (response) {
                    responseValue = response;

                    setTimeout(function() {
                        $("#exampleModalCenter").modal("hide");
                    }, 1000);
    
                   
                    // $("#managerconfirmationtable tr").each(function () {
                    //     ctrl = $(this).find("td:eq(0) input[type='checkbox']");
                        // if (ctrl.prop("checked")) {
                            //compare the objectid with responsevalue filter value
                            // let element = responseValue.filter(
                            //     (task)=>task.EmployeeObjectId === ctrl.data('id')
                            // );


                            // console.log("filtered",element);
                            // element.forEach((task) =>{
                            //     if(task.SAPHTTPCode === "200"){
                            //         $(this).closest("tr")[0].cells[10].innerHTML = "Rejected";
                            //         ctrl.prop("checked",false);
                            //         ctrl.attr("disabled",true);
                            //         $("input:checkbox").prop("checked", false);
                            //     }    
                            //     else{
                            //         toastr.warning("Error Occurred!!!","Error!",{timeout : 1000});
                            //     }
                            // });
                            // responseValue.forEach((element) => {
                            //     if (ctrl.data('id') === element.EmployeeObjectId) {
                            //         if (element.SAPHTTPCode === "200") {
                            //             $(this).closest("tr")[0].cells[10].innerHTML = "Rejected";
                            //             ctrl.prop("checked", false);
                            //             ctrl.attr("disabled", true);

                            //         }
                            //         else {
                            //             toastr.warning("Error Occurred!!!", "Error!", { timeOut: 2000 });
                            //         }
                            //     }
                            // });
                            

                        // }
                        
                    // });
                    $("#managerconfirmationtable tr").each(function () {
                        var ctrl = $(this).find("td:eq(0) input[type='checkbox']");
                        if (ctrl.prop("checked")) {
                            $(this).closest("tr")[0].cells[10].innerHTML = "Rejected";
                            const newArray = managerTimesheetdata.map(object => {
                                if (object.EmployeeItemUUID === ctrl.attr('data-id')) {
                                  // 👇️ change value of name property
                                  return {...object,  Status: "Rejected"};
                                }
                               
                                return object;
                              });
                              managerTimesheetdata = newArray;
                            ctrl.prop("checked", false);
                            ctrl.attr("disabled", true);
                        }
                    });
                    $("input:checkbox").prop("checked", false);
                    toastr.success("Rejected successfully", "Done!", { timeOut: 1500 });

                },
                error: function (response,error,message) {
                    toastr.error("Error Occurred While Processing... Please Try Again or Contact Adiministrator", "Error : " +response.status, { timeOut: 1000 });

                    $("input:checkbox").prop("checked", false);
                    setTimeout(function() {
                        $("#exampleModalCenter").modal("hide");
                    }, 1000);
                    // alert("error : " + response.status);
                    // console.log(JSON.stringify(response.responseJSON.statusCode));
                    // console.log(JSON.stringify(response.responseJSON.body));
                },
            });
        }
        else {
            toastr.warning('Please select atleast 1 record', "Warning!",{ timeOut: 2000 });
        }
    }

    
}


function clickManagerExcel() {
    $('#managerconfirmationtable').DataTable().buttons(0, 0).trigger();
}
function clickManagerAllExcel() {
    $('#managerconfirmationtable').DataTable().buttons(0, 1).trigger();

}

function managerDateFilter() {

    let fromDate = $("#managerfromdate").val();
    let toDate = $("#managertodate").val();

    const date1 = new Date(fromDate);
    const date2 = new Date(toDate);
    function dateDiffInDays(date1, date2) {
        const perDay = 1000 * 60 * 60 * 24;
        const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
        const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

        return Math.floor((utc2 - utc1) / perDay) + 1;
    }
    DifferenceInTwoDates = dateDiffInDays(date1, date2);

    let data = date1.setDate(date1.getDate() + 90);
    let endDate = new Date(data).toISOString().split('T')[0];

    $("#exampleModalCenter").modal("show");

    $.ajax({
        type: "GET",
        url: httpURL+"/directmanagertimesheetapproval?startDate="+fromDate+"&endDate="+toDate+"&managerBusinessPartnerId="+internalID,
        dataType: "json",
        success: function (successdata) {

            setTimeout(function() {
                $("#exampleModalCenter").modal("hide");
            }, 1000);


            managerTimesheetdata = successdata.EmployeeListReport;

            $('#employeenames').find('option').remove().end().append('<option value="">All Employees</option>');
            $('#managerprojectname').find('option').remove().end().append('<option value="">All Projects</option>');
            $('#managerprojecttask').find('option').remove().end().append('<option value="">All Tasks</option>');
            $('#managerschool').find('option').remove().end().append('<option value="">All Schools</option>');
            $('#manageractivity').find('option').remove().end().append('<option value="">All Activities</option>');
            $('#managerstatus').find('option').remove().end().append('<option value="">All Status</option>');

            managerEmployeeNameData = [...new Map(managerTimesheetdata.map(item => [item.EmployeeID, item])).values()];
            managerEmployeeNameData.forEach((element) => {
                if(element.EmployeeName !="" && element.EmployeeName != undefined  ){
                    $("#employeenames").append("<option>" + element.EmployeeName + "</option>");
                }
            });


            managerProjectList = [...new Map(managerTimesheetdata.map(item => [item.ProjectID, item])).values()];
            managerProjectList.forEach((element) => {
                if(element.ProjectName !="" && element.ProjectName != undefined  ){
                    $("#managerprojectname").append("<option>" + element.ProjectName + "</option>");
                }
            });


            managerTaskList = [...new Map(managerTimesheetdata.map(item => [item.TaskName, item])).values()];
            managerTaskList.forEach((element) => {
                if(element.TaskName !="" && element.TaskName != undefined ){
                    $("#managerprojecttask").append("<option>" + element.TaskName + "</option>");
                }
            });

            managerActivityList = [...new Map(managerTimesheetdata.map(item => [item.ActivityName, item])).values()];
            managerActivityList.forEach((element) => {
                if(element.ActivityName !="" && element.ActivityName != undefined  ){
                    $("#manageractivity").append("<option>" + element.ActivityName + "</option>");
                }
            });

            managerSchoolList = [...new Map(managerTimesheetdata.map(item => [item.SchoolDescription, item])).values()];
            managerSchoolList.forEach((element) => {
                if(element.SchoolDescription !="" && element.SchoolDescription != undefined  ){
                    $("#managerschool").append("<option>" + element.SchoolDescription + "</option>");
                }
            });

            managerStatusList = [...new Map(managerTimesheetdata.map(item => [item.Status, item])).values()];
            managerStatusList.forEach((element) => {
                if(element.Status !="" && element.Status != undefined  ){
                    $("#managerstatus").append("<option>" + element.Status + "</option>");
                }
            });

            generateManagerConfimationTable(managerTimesheetdata, "managerconfirmationtable");

            // if (Date.parse(fromDate) > Date.parse(toDate)) {
            //     toastr.error("Invalid Date Range", "Warning!",{ timeOut: 2000 });
            // }
            // else {
            //     if (DifferenceInTwoDates > 181) {
            //         toastr.error("Please Select End Date Before " + endDate + " ( 180 Days Only ).", "Warning!", { timeOut: 2000 });
            //     }
            //     else {
            //         
            //     }
            // }

        },
        error: function (response,error,message) {
            toastr.error("Error Occurred While Processing... Please Try Again or Contact Adiministrator", "Error : " +response.status, { timeOut: 1000 });
            setTimeout(function() {
                $("#exampleModalCenter").modal("hide");
            }, 1000);
        },

    });

}

function fromDateFilter(){
    let fromDate = $("#managerfromdate").val();
    let fromdate = new Date(fromDate);
    let data = fromdate.setDate(fromdate.getDate() + 180);
    let endDate = new Date(data).toISOString().split('T')[0];
    // console.log(endDate);
  
    $('#managertodate').attr('max', endDate);
    $('#managertodate').attr('min',fromDate);
}