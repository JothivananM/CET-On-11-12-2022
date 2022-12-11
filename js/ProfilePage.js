let profilePageList=[];

function profilepage(){
    var firstName = $('#firstName').val();
    var intials = firstName.charAt(0);
    var profileImage = $('#profileImage').text(intials);
}

// console.log(primaryDetails)



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
    if (data.SchoolMandartory) {
        $('#usercheckbox').prop('checked', true);
    } else {
        $('#usercheckbox').prop('checked', false);
    }
    
    profilepage();
}