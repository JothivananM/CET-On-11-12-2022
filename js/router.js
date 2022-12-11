let pagePath;
let table;
let detailsTable;
const route = (event) => {
    event = event || window.event;
    event.preventDefault();

    var href = "";

    if (event.target.nodeName === 'I' || event.target.nodeName === 'P') {
        href = event.target.parentNode.href;
    }

    else {
        href = event.target.href;
    }

    pagePath = event.currentTarget.id;

    // window.history.pushState({}, "", href);
    handleLocation(pagePath);
};

// function tables(rowData){
//     employeefilter = managerPayrollData.filter(
//         (task) => task.EmployeeID === rowData.EmployeeID
//     );

    
//     data = employeefilter.Details;
//     generateManagerPayrollDetailsTable(data,'managerpayrolldetailstable',rowData.Status);
// }

const generateEmployeeReportingTable = (jsonData, TableName) => {
    $.fn.dataTable.ext.errMode = 'none';
    let buttonCommon = {
        exportOptions: {
            format: {
                body: function ( data, row, column, node,full) {
                    if(column ==1 || column == 2 || column == 4 || column==6 || column == 3 )
                    {
                        if(data != undefined){
                            return data.substring(data.indexOf('="')+2,data.indexOf('">'));
                        }
                    }
                    else
                    {
                        return data;  
                    }
                }
            }
        }
    };
    $("#" + TableName).DataTable({
        "responsive":false,
        "lengthChange": false,
        "autoWidth": false,
        "scrollY":300,
        "scrollX":true,
        "scrollCollapse":true,
        "paging":true,
        "pageLength": 50,
        "searching": false,
        "ordering": true,
        "info": true,
        "fixedHeader": {
            "header": true,
            "footer": true
        },
        dom: 'Bfrtip',
        data: jsonData,
        "buttons": [
            $.extend( true, {}, buttonCommon, {
                className:'buttonsToHide',
                "extend": 'excel',
                // "title": primaryDetails.EmployeeName,
                "exportOptions": {
                    "modifier": {
                        "page": 'current'
                    }
                }
            } ),
            $.extend( true, {}, buttonCommon, {
                extend: 'excelHtml5',
                className:'buttonsToHide',
            } ),
            ],
        
        data: jsonData,

        columns: [
            { data: 'Date' },
            { "render": function (data, type, full) {
                let trimprojectName = (full.ProjectID+" | "+ full.ProjectName).trim().length==1?'':(full.ProjectID+" | "+ full.ProjectName);
                 return '<span title="'+trimprojectName+'">'+(trimprojectName.length > 25 ? ((trimprojectName).slice(0, 25)+"..." ): trimprojectName) +'</span>';
            } },
            {
                "render": function (data, type, full) {
                    let taskName = (full.TaskID.trim() +"|"+ full.TaskName.trim()).length == 1? '': (full.TaskID+" | "+full.TaskName);
                    
                   return '<span title="'+taskName+'">'+(taskName.length > 25 ? ((taskName).slice(0, 25)+"..." ): taskName) +'</span>';
                    // console.log((full.TaskID+"|"+taskName).trim().length);
                    // return (full.TaskID+"|"+taskName).trim().length==1?'':(full.TaskID+"|"+ taskName);
                }
            },
            { "render": function (data, type, full) {
                if(full.ActivityName != undefined){
                    return '<span title="'+full.ActivityName+' ">'+(full.ActivityName.length > 25 ? ((full.ActivityName).slice(0, 25)+"..." ): full.ActivityName) +'</span>';
                }
             }
            },
            // { "render": function (data, type, full) {
            //     '<span title="'+full.SchoolID+'">'+((full.SchoolID).length > 15 ? ((full.SchoolID).slice(0, 15)+"..." ): full.SchoolID) +'</span>';
            //  }
            // },
            { "render": function (data, type, full) {
                let trimSchool = ( full.SchoolID +"|"+ full.SchoolDescription.trim()).length == 1? '': ( full.SchoolID +" | "+full.SchoolDescription);
                    return '<span title="'+trimSchool+'">'+(trimSchool.length > 25 ? ((trimSchool).slice(0, 25)+"..." ):trimSchool) +'</span>';
                 }
            },
            { "render": function (data, type, full) {
                return (full.Hours).substring(2,(full.Hours).length-1).replace("H",":");
                } 
            },
            { "render": function (data, type, full) {
                    return '<span title="'+full.Description+'">'+(full.Description.length > 15 ? ((full.Description).slice(0, 15)+"..." ): full.Description) +'</span>';
                 }
            },
            { data: 'Status'}
        ],
        
        "bDestroy": true
    });
}

const generateManagerConfimationTable = (jsonData, TableName) => {
    
    $.fn.dataTable.ext.errMode = 'none';
    let buttonCommon = {
        exportOptions: {
            format: {
                body: function ( data, row, column, node,full) {
                    if(column ==1 || column == 3 || column == 4 || column==5 || column == 6 || column == 8 )
                    {
                        if(data != undefined){
                            return data.substring(data.indexOf('="')+2,data.indexOf('">'));
                        }
                    }
                    else if(column == 0){
                        return data = '';
                    }
                    else
                    {
                        return data;  
                    }
                
                }
            }
        }
    };
    $("#" + TableName).DataTable({
        "responsive": false,
        "lengthChange": false,
        "autoWidth": false,
        "scrollY":300,
        "scrollX":true,
        "scrollCollapse":true,
        "paging":true,
        "pageLength": 40,
        "searching": false,
            "ordering": true,
            "info": true,
        "fixedHeader": {
            "header": true,
            "footer": true
        },
        dom: 'Bfrtip',
        data: jsonData,

            "buttons": [
                $.extend( true, {}, buttonCommon, {
                    className:'buttonsToHide',
                    "extend": 'excel',
                    "exportOptions": {
                        "modifier": {
                            "page": 'current'
                        }
                    }
                } ),
                $.extend( true, {}, buttonCommon, {
                    extend: 'excelHtml5',
                    className:'buttonsToHide',
                } ),
                

            ],
        // rowId : jsonData.ObjectId,
        'columns': [
            {
                "render": function (data, type, full) {
                    if(full.Status == "Not Confirmed"){
                        return '<input type="checkbox" id="" name="" data-id='+ full.EmployeeItemUUID +'>';
                    }
                    else{
                        return '<input type="checkbox" id="" name="" data-id='+ full.EmployeeItemUUID +' disabled>';
                    }
                },
            },
            // { data: 'EmployeeID'},
            { "render": function (data, type, full) {
                let trimempid = (full.EmployeeID+" | "+ full.EmployeeName).trim().length==1?'':(full.EmployeeID+" | "+ full.EmployeeName);
                return '<span title="'+trimempid+'">'+((trimempid).length > 25 ? ((trimempid).slice(0, 20)+"..." ): trimempid) +'</span>';
             }
            },
            { data: 'Date' },
            // { data: 'ProjectID' },
            {
                "render": function (data, type, full) {
                let trimprojectName = (full.ProjectID+" | "+ full.ProjectName).trim().length==1?'':(full.ProjectID+" | "+ full.ProjectName);
                    return '<span title="'+trimprojectName+'">'+((trimprojectName).length > 25 ? ((trimprojectName).slice(0, 25)+"..." ):trimprojectName) +'</span>';
                 }
            },
            // { data: 'TaskID' },
            {
                "render": function (data, type, full) {
                    let taskName = (full.TaskID.trim() +"|"+ full.TaskName.trim()).length == 1? '': (full.TaskID+" | "+full.TaskName);
                    
                   return '<span title="'+taskName+'">'+(taskName.length > 25 ? ((taskName).slice(0, 25)+"..." ): taskName) +'</span>';
                    // console.log((full.TaskID+"|"+taskName).trim().length);
                    // return (full.TaskID+"|"+taskName).trim().length==1?'':(full.TaskID+"|"+ taskName);
                }
            },
            { "render": function (data, type, full) {
                if(full.ActivityName != undefined){
                    return '<span title="'+full.ActivityName+'">'+(full.ActivityName.length > 25 ? ((full.ActivityName).slice(0, 15)+"..." ): full.ActivityName) +'</span>';
                }
             }
            },
            // { "render": function (data, type, full) {
            //     '<span title="'+full.SchoolID+'">'+((full.SchoolID).length > 15 ? ((full.SchoolID).slice(0, 15)+"..." ): full.SchoolID) +'</span>';
            //  }
            // },
            { "render": function (data, type, full) {
                let trimSchool = ( full.SchoolID +"|"+ full.SchoolDescription.trim()).length == 1? '': ( full.SchoolID +" | "+full.SchoolDescription);
                    return '<span title="'+trimSchool+'">'+(trimSchool.length > 25 ? ((trimSchool).slice(0, 25)+"..." ):trimSchool) +'</span>';
                 }
            },
            { "render": function (data, type, full) {
               return (full.Hours).substring(2,(full.Hours).length-1).replace("H",":");
            } },
            { "render": function (data, type, full) {
                return '<span title="'+full.Description+'">'+((full.Description).length > 15 ? ((full.Description).slice(0, 15)+"..." ): full.Description) +'</span>';
             }
            },
            { data: 'Status' },
            ],
        // "columnDefs": [ {
        //     "targets": 0,
        //     "orderable": false
        //     } ],
        "bDestroy": true,

       

    });
    // $("#example_info").detach().appendTo('#pagefooter');
    // $("#example_paginate").detach().appendTo('#pagefooter');
    }

const generateManagerPayrollTable = (jsonData, TableName) => {
    // console.log("DATATABLE JSON",jsonData);
    $.fn.dataTable.ext.errMode = 'none';
    
    table = $("#" + TableName).DataTable({
        "responsive": false,
        "lengthChange": false,
        "autoWidth": false,
        "pageLength": 10,
        "autoWidth": false,
        "scrollY":145,
        "scrollX":true,
        "searching": false,
        "ordering": true,
        "fixedHeader": {
            "header": true,
            "footer": true
        },
        "info": false,
        "paging":true,
        // "language" : {
        //     "zeroRecords": " "             
        // },
        // "dom": ',
        dom: 'Bfrtip',
        "buttons": [    
            {
                className:'buttonsToHide',
                "extend": 'excel',
                "title":'Report',
                "exportOptions": {
                    "modifier": {
                        "page": 'current'
}
                }
            },
            {
                className:'buttonsToHide',
                "extend": 'excel',
                "text": '<i class="fa fa-download" aria-hidden="true"></i>',
                "titleAttr": 'Download All Pages'
            },

        ],
        data: jsonData,
        // rowId : jsonData.ObjectId,
        'columns': [
            { data: 'MonthYear' },
            { data: 'EmployeeName' },
            { "render": function (datas, type, full) {
                return Number(full.ReportedHours).toFixed(2)
            }},
            { "render": function (data, type, full) {
                    if(full.Status == "Draft"){
                        return `<span class="buttonstatus" style="font-size:12px">`+full.Status+`</span>
                        <input type="button" class="btn-outline-success approvebutton approved" data-reportedHours="`+full.ReportedHours+`" data-empid="`+full.EmployeeID+`" data-status="`+full.Status+`" data-sapuuid="`+full.SAPUUID+`" data-objectid="`+full.ObjectID +`" onclick="approveData(this)" value="Approve">`;
                    }
                    else{
                        return  `<span class="buttonstatus" style="font-size:12px">`+full.Status+`</span>
                        <input type="button" class="approvebutton approved" data-reportedHours="`+full.ReportedHours+`" data-empid="`+full.EmployeeID+`" data-status="`+full.Status+`" data-sapuuid="`+full.SAPUUID+`" data-objectid="`+full.ObjectID +`" onclick="approveData(this)" value="Approve" style="display:none">`;;
                    }
                },
            }
        ],
        "destroy": true,
    });

    tableSelect(table,TableName);
    
}

const generateManagerPayrollDetailsTable = (jsonData, TableName,Value) => {
    $.fn.dataTable.ext.errMode = 'none';
    detailsTable = $("#" + TableName).DataTable({
        "destroy" : true,
        "responsive": false,
        "lengthChange": false,
        "autoWidth": false,
        "scrollY":300,
        "scrollX":true,
        "fixedHeader": {
            "header": true,
            "footer": true
        },
        // "pageLength": 5, 
        "searching": false,
        "ordering": false,
        "info": false,
        "paging":false,
        dom: 'Bfrtip',
        
        "buttons": [    
            {
                className:'buttonsToHide',
                "title":'Report',
                "exportOptions": {
                    "modifier": {
                        "page": 'current'
                    }
                }
            },
            {
                className:'buttonsToHide',
                "extend": 'excel',
                "text": '<i class="fa fa-download" aria-hidden="true"></i>',
                "titleAttr": 'Download All Pages'
            },

        ],
        data: jsonData,
        'columns': [
            {
                className:'details-control',
                orderable: false,
                data: null,
                defaultContent: ''
            },
            { data: 'TypeofHours' },
            { data: 'ProjectID'},
            { data: 'ProjectName' },
            { "render": function (datas, type, full) { 
                return Number(full.ReportedHours).toFixed(2)
            }},
            { "render": function (datas, type, full) { 
                return Number(full.ReportedHoursPercentage).toFixed(2)
            }},
            // { "render": function (datas, type, full,cells) {
                {"render" : function(datas, type, full,cells) {
                //     console.log("data",cells[5]);
                //     if (full.TypeofHours === 'Vacation') {
                //        $('#managerpayrolldetailstable tbody tr td.details-control').removeAttr('class');
                //     }
                //   }  
                if(Value == "Approved"){
                    // $('#addRow').hide();
                    // $('#save').hide();
                    return "<input type='number' class='approvehours changed'  style='background-color: #cecece43' data-id="+ full.ProjectUUID +" data-changed='false' onchange='inputchanged()' onblur='addingvalues(this)' value='"+Number(full.ApprovedHours).toFixed(1)+"' disabled>"
                }
               else{
                    if(full.TypeofHours == "Vacation" || full.TypeofHours == "Absence" ||  full.TypeofHours == "Absent (unspecified)"  ){
                        return "<input type='number' class='approvehours changed' style='background-color: #cecece43' data-id="+ full.ProjectUUID +" data-changed='false' onchange='inputchanged()' onblur='addingvalues(this)'  value='"+Number(full.ApprovedHours).toFixed(1)+"' disabled>"
                    }
                    else{
                        return "<input type='number' style='font-size:12px;' class='approvehours changed' data-id="+ full.ProjectUUID +" data-changed='false' data-projectid='"+full.ProjectID+"' onblur='addingvalues(this)'  onchange=inputchanged(this) value='"+Number(full.ApprovedHours).toFixed(1)+"' style='font-size:12px;'>"
                    
                    }
               }
            },
            }
        ],
        "createdRow": function (row, data) {
            if(data.TaskDetails.length == 0){
                $(row).find("td:first").removeClass('details-control');
            }
          },
        "bDestroy": true,
    });


    insideTable(TableName,detailsTable);
}

const handleLocation = async (path) => {
   if (path == undefined || path == "") {
     path = "EmployeeTimeBookingPage";
    //    path = "ContractTimesheetPage";
   }
 
    const route = '/pages/'+path+'.html';
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;

    if (path === "EmployeeReportingPage") {
        // $('#calendar').hide();
        $('.headerName').text('Report');
        // $('myTitle').text('Timesheet Booking Portal | Report');
        document.title = 'Timesheet Booking Portal | Report';
                $('.calendar-content').hide();

        $("#exampleModalCenter").modal("show");

        // $("#header-name").text("");
        employeeReportingList();


        setTimeout(function() {
            $("#exampleModalCenter").modal("hide");
          }, 1500);

        setDate();
        $('.select2').select2(
        {
                dropdownAutoWidth: true,
                selectionTitleAttribute: false
            },
        );
    }
    else if(path === "ManagerTimesheetConfirmationPage") {
        // $('#calendar').hide();
        $('.headerName').text('Time Confirmation');
        document.title = 'Timesheet Booking Portal | Time Confirmation';


        $('.calendar-content').hide();

        $("#exampleModalCenter").modal("show");

        // $("#header-name").text("Manager Timesheet Confirmation Page");

        
        managerTimesheetConfirmation();

        setTimeout(function() {
            $("#exampleModalCenter").modal("hide");
          }, 1500);

        setDate();
        
        $('.select2').select2(
        {
                dropdownAutoWidth: true,
                selectionTitleAttribute: false
            },
        );

        $("#select-all").click(function () {
            $('input:checkbox:enabled').prop('checked',this.checked);
        });


        
        // $('#select-all').on('click', function(){
        //     // Check/uncheck all checkboxes in the table
        //     var rows = table.rows({ 'search': 'applied' }).nodes();
        //     alert(rows);
        //     $('input[type="checkbox"]', rows).prop('checked', this.checked);
        //  });

        // $("#check").click(function(){
        //     $('input:checkbox').not(this).prop('checked', this.checked);

        // });
    }
    else if (path === "ProfilePage") {
        $('.headerName').text('Profile');
        document.title = 'Timesheet Booking Portal | Profile';


        // $('#calendar').hide();
        $('.calendar-content').hide();

        $("#exampleModalCenter").modal("show");

        $("#header-name").text("Profile Page");

        profileData(primaryDetails);

        setTimeout(function() {
            $("#exampleModalCenter").modal("hide");
          }, 1500);
    }
    else if (path === "EmployeeTimeBookingPage") {
        //    $('#calendar').show();
        $('.headerName').text('Time Booking');
        document.title = 'Timesheet Booking Portal | Time Booking';


        $('.calendar-content').show();
       
        //  $('#main-page').hide();

            if (primaryDetails.EmployeeCatagory == 'EC5') {
                displayTimesheetContract();
            } 

            else {
                displayTimesheet();
            }
        

            $('.select2').select2(
                {
                    dropdownAutoWidth: true
                },
            );
    }
    else if(path === "ManagerPayrollProcessingPage"){
        selectedYear();
        // $('#calendar').hide();
        $('.headerName').text('Payroll Approval');
        document.title = 'Timesheet Booking Portal | Payroll Approval';
        $('.calendar-content').hide();

        $("#exampleModalCenter").modal("show");

        datamodified = false;
        count = 0;
        managerPayrollList();



        hidetable();


        setTimeout(function() {
            $("#exampleModalCenter").modal("hide");
          }, 1500);

        $('.select2').select2(
            {
                dropdownAutoWidth: true,
                selectionTitleAttribute: false
            },
        );
    }

    else if (path === "ContractReportingStatusPage") {

        document.title = 'Timesheet Booking Portal | Report status';

        $('.calendar-content').hide();

        contractReport();
    }
    else if (path === "ContractApprovalPage") {

        document.title = 'Timesheet Booking Portal | Report status';

        $('.calendar-content').hide();

        contractReport();
    }

    // else if (path === "ContractTimesheetPage") {
    //     //    $('#calendar').show();
    //     $('.headerName').text('Time Booking');
    //     document.title = 'Timesheet Booking Portal | Time Booking';

    //     displayTimesheetContract();
    //     $('.calendar-content').show();
       
    //     //  $('#main-page').hide();

    //         $('.select2').select2(
    //             {
    //                 dropdownAutoWidth: true
    //             },
    //         );
   //}
};

function selectedYear(){
    let currentYear = new Date().getFullYear();
    let selectedYear = '';
    let SelectedMonth = '';
    for (let i = currentYear ; i>=2020;i--) {
        selectedYear = currentYear;
        if(i===currentYear)
        {
            $("#selectYear").append('<option value="' + i + '" selected>' + i + '</option>');
        }
        else
        {
        $("#selectYear").append('<option value="' + i + '">' + i + '</option>');
        }
    }

    let currentMonth = new Date().getMonth()+1;
    for (let i = 1; i <= 12; i++) {
        SelectedMonth = currentMonth;

        $("#selectMonth").append('<option value="' + i + '" selected='+SelectedMonth+'>' + i + '</option>');
    }
}

// window.onpopstate = handleLocation;
window.route = route;
handleLocation();

