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
    // $("#" + TableName).on('error.dt', function (e, settings, techNote, message) {
    //     console.log('An error has been reported by DataTables: ', message);
    // });
    $("#" + TableName).DataTable({
        "responsive":false,
        "lengthChange": false,
        "autoWidth": false,
        "scrollY":300,
        "scrollX":true,
        "scrollCollapse":true,
        "paging":true,
        "pageLength": 25,
        "searching": false,
        "ordering": true,
            "info": true,
        "fixedHeader": {
            "header": true,
            "footer": true
        },
        dom: 'Bfrtip',
           
        "buttons": [
                {
                className:'buttonsToHide',
                "extend": 'excel',
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
            }
            ],
        
        data: jsonData,

        columns: [
            { data: 'Date' },
            { data: 'ProjectID' },
            {
                "render": function (data, type, full) {
                    return '<span title="'+full.ProjectName+'">'+(full.ProjectName.length > 15 ? ((full.ProjectName).slice(0, 15)+"..." ):full.ProjectName) +'</span>';
                 }
            },
            { data: 'TaskID' },
            {
                "render": function (data, type, full) {
                    return '<span title="'+full.TaskName+'">'+(full.TaskName.length > 15 ? ((full.TaskName).slice(0, 15)+"..." ): full.TaskName) +'</span>';
                 }
            },
            { "render": function (data, type, full) {
                if(full.ActivityName != undefined){
                    return '<span title="'+full.ActivityName+'">'+(full.ActivityName.length > 15 ? ((full.ActivityName).slice(0, 15)+"..." ): full.ActivityName) +'</span>';
                }
             }
            },
            { "render": function (data, type, full) {
                '<span title="'+full.SchoolID+'">'+((full.SchoolID).length > 15 ? ((full.SchoolID).slice(0, 15)+"..." ): full.SchoolID) +'</span>';
             }
            },
            { "render": function (data, type, full) {
                    return '<span title="'+full.SchoolDescription+'">'+(full.SchoolDescription.length > 15 ? ((full.SchoolDescription).slice(0, 15)+"..." ): full.SchoolDescription) +'</span>';
                 }
            },
            { "render": function (data, type, full) {
                return '<span>'+(full.Hours).substring(2,(full.Hours).length-1).replace("H",":")+'</span>';
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
    // $("#" + TableName).on('error.dt', function (e, settings, techNote, message) {
    //     console.log('An error has been reported by DataTables: ', message);
    // });

    $("#" + TableName).DataTable({
        "responsive": false,
            "lengthChange": false,
        "autoWidth": true,
        "scrollY":300,
        "scrollX":true,
        "scrollCollapse":true,
        "paging":true,
        "pageLength": 20,
        "searching": false,
            "ordering": true,
            "info": true,
        "fixedHeader": {
            "header": true,
            "footer": true
        },
        dom: 'Bfrtip',
            "buttons": [
                {
                className:'buttonsToHide',
                    "extend": 'excel',
               
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
                },

            ],
        data: jsonData,
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
            { data: 'EmployeeID'},
            { "render": function (data, type, full) {
                return '<span title="'+full.EmployeeName+'">'+((full.EmployeeName).length > 15 ? ((full.EmployeeName).slice(0, 15)+"..." ): full.EmployeeName) +'</span>';
             }
            },
            { data: 'Date' },
            { data: 'ProjectID' },
            {
                "render": function (data, type, full) {
                    return '<span title="'+full.ProjectName+'">'+((full.ProjectName).length > 15 ? ((full.ProjectName).slice(0, 15)+"..." ):full.ProjectName) +'</span>';
                 }
            },
            { data: 'TaskID' },
            {
                "render": function (data, type, full) {
                    return '<span title="'+full.TaskName+'">'+((full.TaskName).length > 15 ? ((full.TaskName).slice(0, 15)+"..." ): full.TaskName) +'</span>';
                 }
            },
            { "render": function (data, type, full) {
                if(full.ActivityName != undefined){
                    return '<span title="'+full.ActivityName+'">'+(full.ActivityName.length > 15 ? ((full.ActivityName).slice(0, 15)+"..." ): full.ActivityName) +'</span>';
                }
             }
            },
            { "render": function (data, type, full) {
                '<span title="'+full.SchoolID+'">'+((full.SchoolID).length > 15 ? ((full.SchoolID).slice(0, 15)+"..." ): full.SchoolID) +'</span>';
             }
            },
            { "render": function (data, type, full) {
                return '<span title="'+full.SchoolDescription+'">'+((full.SchoolDescription).length > 15 ? ((full.SchoolDescription).slice(0, 15)+"..." ): full.SchoolDescription) +'</span>';
             }
            },
            { "render": function (data, type, full) {
               return '<span>'+(full.Hours).substring(2,(full.Hours).length-1).replace("H",":")+'</span>';
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
        "pageLength": 5,
        "searching": false,
        "ordering": false,
        "info": false,
        // "dom": ',
        dom: 'Bfrtip',
        "buttons": [    
            {
                className:'buttonsToHide',
                "extend": 'excel',
               
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
        "bDestroy": true,
    });

    tableSelect(TableName);
    
}

const generateManagerPayrollDetailsTable = (jsonData, TableName,Value) => {
    $.fn.dataTable.ext.errMode = 'none';
    detailsTable = $("#" + TableName).DataTable({
        "destroy" : true,
        "responsive": false,
        "lengthChange": false,
        "autoWidth": true,
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
                "extend": 'excel',
               
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
                    $('#addRow').hide();
                    $('#save').hide();
                    return "<input type='number' class='approvehours changed'  style='background-color: #cecece43' data-id="+ full.ProjectUUID +" data-changed='false' onchange='inputchanged()' value='"+Number(full.ApprovedHours).toFixed(1)+"' disabled>"
                }
               else{
                    if(full.TypeofHours == "Vacation" || full.TypeofHours == "Absence" ){
                        return "<input type='number' class='approvehours changed' style='background-color: #cecece43' data-id="+ full.ProjectUUID +" data-changed='false' onchange='inputchanged()' value='"+Number(full.ApprovedHours).toFixed(1)+"' disabled>"
                    }
                    else{
                        return "<input type='number' style='font-size:10px;' class='approvehours changed' data-id="+ full.ProjectUUID +" data-changed='false' data-projectid='"+full.ProjectID+"' onchange=inputchanged(this) value='"+Number(full.ApprovedHours).toFixed(1)+"' style='font-size:12px;'>"
                    
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

        profilepagedata();

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
            displayTimesheet();

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

