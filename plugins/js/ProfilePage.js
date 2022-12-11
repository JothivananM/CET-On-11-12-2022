let profilePageList=[];

function profilepage(){
    var firstName = $('#firstName').val();
    var intials = firstName.charAt(0);
    var profileImage = $('#profileImage').text(intials);
}

// console.log(primaryDetails)

function profilepagedata(){
    $.ajax({
        type: "GET",
        url: httpURL+"/employeeDetails?employeeMailId="+primaryDetails.EmailId,
        dataType: "json",
        async: false,
        success: function (successdata) {
            // alert(JSON.stringify(successdata))
            console.log(successdata);
            profilePageList = successdata.EmployeeDetails;
            profileData(profilePageList);
        },
        error: function (response,error,message) {
            toastr.error("Error Occurred : " +response.responseJSON.body, "Error : " +response.status, { timeout: 1000 });
            // alert("error : " + response.status);
            // console.log(JSON.stringify(response.responseJSON.statusCode));
            // console.log(JSON.stringify(response.responseJSON.body));
        },
    });
}

function profileData(data){
    $('.profile-username').text(data.FirstName);
    $('#spanName').val(data.FirstName);
    $('#span').text(data.FirstName +" "+data.LastName);
    $('#empuuid').val(data.EmployeeId);
    $('#partnerid').val(data.BusinessPartnerId);
    $('#firstName').val(data.FirstName);
    $('#lastName').val(data.LastName);
    $('#inputEmail').val(data.EmailId);
    $('#inputUserCategory').val(data.EmployeeCatagory);
    $('#inputService').val(data.EmployeeService);
    $('#usercheckbox').val(data.SchoolMandartory);

    profilepage();
}