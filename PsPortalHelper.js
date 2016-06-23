({

    loadPermissionSetOptions: function(component) {
        this.clearAllAttributes(component);
        this.contactServertoGetPermissionSet(component);
        this.assigningValueToAInput(component);
    },

    pageRenderingCompleted : function(component, event) {
        // If this to be implemented, get it from previous code
    },

    showSpinnerHelperClass : function(component, event) {
        var spinner = component.find('spinner');
        var evt = spinner.get("e.toggle");
        evt.setParams({ isVisible : true });
        evt.fire();
    },

    assigningValueToAInput: function(cmp) {
        // If this to be implemented, get it from previous code
    },

    clearAllAttributes : function(cmp) {
        try{
            console.log(document.toString());
            var permissionSetNamesDataSetasInputAsValue = cmp.get("{!v.permissionSetNamesDataSetasInput}");
            if(permissionSetNamesDataSetasInputAsValue != undefined) {
                cmp.set("v.pSetValuesForComparisions", permissionSetNamesDataSetasInputAsValue);
                cmp.set("v.permissionSetNamesDataSetasInput", "");
            }
            var allPsDetails_as_value = cmp.get("{!v.allPsDetails}");
            if(allPsDetails_as_value != undefined) {
                cmp.set("v.allPsDetails", "");
            }
            var changedAllObjectDetails_as_value = cmp.get("{!v.changedAllObjectDetails}");
            if(changedAllObjectDetails_as_value != undefined) {
                cmp.set("v.changedAllObjectDetails", "");
            }
        }
        catch(error) {
            console.log("error occured at clearAllAttributes: " + error);
        }
    },

    //contact server to retrieve All Permission Sets of the Organization
    contactServertoGetPermissionSet: function(component) {
        try {
            var action = component.get('c.getAllPermissionSets');
            var all_permissionSet_details = component.get("{!v.allPsDetails}");
            if(all_permissionSet_details == null || all_permissionSet_details.length === 0) {
                action.setCallback(this, function(response) {
                    var state = response.getState();

                    if (component.isValid() && state === "SUCCESS") {
                        this.addingPermissionSetNames(response.getReturnValue());
                        component.set("v.permissionSetNamesDataSetasInput", response.getReturnValue());

                        //NOTE: adding PSet Details to PsPortalHelper.js PSetDetails Class
                        component.set("v.allPsDetails", this.addPSetDetailsToListofPSets(response.getReturnValue()));
                    }
                });
                $A.enqueueAction(action);
            }
        }
        catch(error) {
            console.log("error occured at contactServertoGetPermissionSet: " + error);
        }
    },

    addingPermissionSetNames : function(permissionSetNamesDataSetasInput) {
        try{
            var fragment = document.createDocumentFragment();
            var opt = document.createElement('option');
            opt.innerHTML = "Choose an option";
            opt.value = "NothingSelected";
            fragment.appendChild(opt);
            for(var i=0;i<permissionSetNamesDataSetasInput.length;i++) {

                opt = document.createElement('option');
                opt.innerHTML = permissionSetNamesDataSetasInput[i].label;
                opt.value = permissionSetNamesDataSetasInput[i].id;
                fragment.appendChild(opt);
            }
            var permissionsSet_Select = $('#permissionSetNamesddl');
            var length = permissionsSet_Select.children('option').length;
            if(length > 0 ) {
                permissionsSet_Select.empty();
            }

            $('#permissionSetNamesddl').append(fragment);
        }
        catch(error) {
            console.log("error occured at addingPermissionSetNames: " + error);
        }
    },

    //NOTE: Method for adding Individual Permission Set Class Object to "allPSetDetails" Global variable
    addPSetDetailsToListofPSets : function(pSetDetailsFromServer){
        var allPSetDetails = [];
        for(var i=0;i<pSetDetailsFromServer.length;i++) {
            //posibility of error
            allPSetDetails.push(this.createAPermissionSetDetailsClass(pSetDetailsFromServer[i].label, pSetDetailsFromServer[i].name, pSetDetailsFromServer[i].id, pSetDetailsFromServer[i].description, pSetDetailsFromServer[i].namespacePrefix, pSetDetailsFromServer[i].userLicenseId, pSetDetailsFromServer[i].createdDate));
        }
        return allPSetDetails;
    },

    //TEMP Fix
    //This method is a temp fix for errors in SF Summer'16 release
    getSelectedChild : function(elementChildren) {
      var returnVal;
      console.log('elementChildren.length: ' + elementChildren.length);
      for(var i=0;i<elementChildren.length;i++) {
          if(elementChildren[i].selected) {
            returnVal = elementChildren[i];
            break;
          }
          else {
            elementChildren[i] = null;
          }
      }

      return returnVal;
    },

    permissionSetNamesddlChangeHelperCall : function(component,event) {
        try{
            // var value = $('#'+event.srcElement.id);
            // console.log("This is where I can check stuff: ");
            // console.log(value);
            // var selectedVal = $('#'+event.srcElement.id).val();

            var selectedVal = $('#' + event.srcElement.id).find(":selected").text();

            console.log(selectedVal);

            // var elementChildren = document.getElementById(event.srcElement.id).childNodes;
            // var selectedChildObject = this.getSelectedChild(elementChildren);
            // var selectedVal = selectedChildObject.value;

            if(selectedVal === "NothingSelected") {
                // this.swapVisibilityOfButtons(true);
                this.swapObjectDivVisibility(false);
                this.swapPsDetailsDivVisibility(false,selectedVal);
            }
            else {
                this.swapEditCloneButtonsDisability(false);
                this.swapObjectDivVisibility(true);
                this.swapPsDetailsDivVisibility(true,selectedVal);
                // this.getObjectPermissionsFromServer(component,event);
                this.getObjectPermissionsFromServer(component,selectedVal);
                this.disablingEverything();
            }
            $('#creatingNewPermissionSetDetails').hide();
        }
        catch(error) {
            console.log("error occured at permissionSetNamesddlChangeHelperCall: " + error);
        }
    },

    //NOTE: Permission Set Edit Server call
    permissionSetEditServerCall: function(cmp, event){
        this.enablingObjectLevelPermissions();
        this.enablingEverything();
        cmp.set("v.checkIfEditIsClicked", true);
    },

    permissionSetCloneServerCall: function(){
        ////console.log("Clone click");
    },

    swapEditCloneButtonsDisability: function(option){
        $('#permissionSetEditBtn').prop("disabled",option);
    },


    swapObjectDivVisibility: function(option){
      try{
        if(option){
            // $('#mainDivForAllSubDivs').show('slow');
            document.getElementById('mainDivForAllSubDivs').style.display = "block";
        }
        else {
            // $('#mainDivForAllSubDivs').slideUp('slow');
            document.getElementById('mainDivForAllSubDivs').style.display = "none";
        }
      }
      catch(error){
        console.log("error occured at swapObjectDivVisibility: " + error);
      }
    },

    swapPsDetailsDivVisibility: function(option,individualPSetId) {
        try{
            if(option) {
                $('#PermissionSetDetailsDiv').children().hide();
                // $('#PermissionSetDetailsDiv').show();
                // $('#'+individualPSetId+'IndividualDiv').show('slow');
                document.getElementById('PermissionSetDetailsDiv').style.display = "block";
                document.getElementById(individualPSetId + 'IndividualDiv').style.display = "block";
            }
            else {
                $('#PermissionSetDetailsDiv').children().hide();
                // $('#PermissionSetDetailsDiv').hide();
                // $('#'+individualPSetId+'IndividualDiv').slideUp('slow');
                document.getElementById('PermissionSetDetailsDiv').style.display = "none";
                document.getElementById(individualPSetId + 'IndividualDiv').style.display = "none";
            }
        }
        catch(error) {
            console.log("error occured at swapPsDetailsDivVisibility: " + error);
        }
    },

    // getObjectPermissionsFromServer : function(component,event) {
    getObjectPermissionsFromServer : function(component,selectedpSetId) {
        // var pSetId = $('#'+event.srcElement.id).val();
        var pSetId = selectedpSetId;
        this.getAllObjectPermissions(component, pSetId);
    },

    getAllObjectPermissions : function(component, pSetId) {
        //getObjectPermissionsConcerningPermissionSet
        try {
            var action = component.get("c.getAllObjectData");
            action.setParams({ PSetId : pSetId});

            action.setCallback(this, function(response) {
                var state = response.getState();
                if (component.isValid() && state === "SUCCESS") {
                    component.set("v.objectNames", response.getReturnValue());

                    var objectDetailsWithPermissionsasJSON = JSON.stringify(response.getReturnValue());

                    if(!this.checkIfDataHasRequiredString(objectDetailsWithPermissionsasJSON, '"read":false')){
                        // make all read true
                        $('#readforAllObjsChkBox').prop('checked',true);
                    }
                    if(!this.checkIfDataHasRequiredString(objectDetailsWithPermissionsasJSON, '"viewAll":false')){
                        // make all viewAll true
                        $('#viewAllforAllObjsChkBox').prop('checked',true);
                    }
                    if(!this.checkIfDataHasRequiredString(objectDetailsWithPermissionsasJSON, '"modifyAll":false')){
                        // make all modifyAll true
                        $('#modifyAllforAllObjsChkBox').prop('checked',true);
                    }
                    if(!this.checkIfDataHasRequiredString(objectDetailsWithPermissionsasJSON, '"edit":false')){
                        // make all edit true
                        $('#editforAllObjsChkBox').prop('checked',true);
                    }
                    if(!this.checkIfDataHasRequiredString(objectDetailsWithPermissionsasJSON, '"deleteData":false')){
                        // make all deleteData true
                        $('#deleteforAllObjsChkBox').prop('checked',true);
                    }
                    if(!this.checkIfDataHasRequiredString(objectDetailsWithPermissionsasJSON, '"create":false')){
                        // make all create true
                        $('#createforAllObjsChkBox').prop('checked',true);
                    }
                }
                else if(state === "ERROR"){
                    console.log("There's an error at getAllObjectPermissions: " + response.getError());
                }
            });
            $A.enqueueAction(action);
        }
        catch(error) {
            console.log("error occured at getAllObjectPermissions: " + error);
        }
    },

    //IDEA: For optimizing the code and to remove number of calls to server
    // 1) store every different PSet's object details in a list
    // 2) check if (the same Pset is selected again from the drop down list) object details are present in the list saved allObjsDataForChangingExpandBtnValue
    // 3) if they are available, populate to the front end
    //4) if not go touch server for data

    //IDEA: For code optimization and making fewer calls to server
    // while getting the Object details, we can also retrieve field details as the same DescribeSObject is used for retrieving
    // each Object's Fields
    // This way, only fewer calls are made to server
    // But, while retrieving Object details itself it may take longer time than expected

    //IDEA: For code optimization
    // While updating object / field permissions instead of updating single values, you can update a keyset
    // As of now, you are updating single values in each iteration like a for loop.

    checkIfDataHasRequiredString : function(Data, stringToSearch){
        if(Data.search(stringToSearch) == -1) {
            return false;
        }
        else {
            return true;
        }
    },

    //NOTE: Permission Set CREATE NEW CLICK

    permissionSetCreateNewServerCall: function(component, event) {
        try{
            console.log("Create New click");

            //update global variable saying Create New is created
            component.set("v.checkIfCreatedIsClicked", true);

            //make visible false all required divs
            this.makeVisibleFalseAllRequiredDivs();

            //make visible true all required divs
            this.makeVisibleTrueAllRequiredDivs();

            //empty all the global variables
            this.clearAllAttributes(component);

            //empty extra global variables
            this.emptyExtraAttributes(component);

            //close Edit Permissions On Individual Objs And Fields
            if($('#PointerForEditPermissionsonIndividualObjectsandFields').val() == "-") {
                this.swapPlusandMinusButton('PointerForEditPermissionsonIndividualObjectsandFields','editPermissionsonIndividualObjectsandFields');
            }

            //load values into User License and make it visible
            this.loadUserLicenseValues(component);

            //load load all objects
            this.loadAllObjectsForCreateNew(component);

            //make all checkbox's un select
            $("input:checkbox").removeAttr('checked');

            //enabling everything so that a new PSet details can be written
            this.enablingEverything();

            //disabling drop down list and edit button so that it their functionality will be locked
            this.disablePSetDropDownListnEditBtn();
        }
        catch(error) {
            console.log("error occured at permissionSetCreateNewServerCall: " + error);
        }
    },

    makeVisibleFalseAllRequiredDivs : function() {
        $('#PermissionSetDetailsDiv').slideUp('slow');
    },

    makeVisibleTrueAllRequiredDivs : function() {
        $('#mainDivForAllSubDivs').show('slow');
        $('#creatingNewPermissionSetDetails').show('slow');
    },

    emptyExtraAttributes : function(cmp) {
        //emptying extra global variables
        try{
            var allObjectDetailsAsVal = cmp.get("{!v.allObjectDetails}");
            var objectNames_as_Val = cmp.get("{!v.objectNames}");
            if(allObjectDetailsAsVal != undefined){
                cmp.set("v.allObjectDetails", "");
            }
            if(objectNames_as_Val != undefined) {
                cmp.set("v.objectNames", "");
            }
        }
        catch(error) {
            console.log("error occured at emptyExtraAttributes: " + error);
        }
    },

    loadUserLicenseValues : function(component) {
        try{
            var action = component.get("c.getAllUserLicenses");
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (component.isValid() && state === "SUCCESS") {
                    this.addingUserLicenseNames(response.getReturnValue());
                }
            });
            $A.enqueueAction(action);
        }
        catch(error) {
            console.log("error occured at loadUserLicenseValues: " + error);
        }
    },

    addingUserLicenseNames : function(userLicenseDataAsInput) {
        try {
            var fragment = document.createDocumentFragment();
            var opt = document.createElement('option');
            opt.innerHTML = "Choose an option";
            opt.value = "NothingSelected";
            fragment.appendChild(opt);
            for(var i=0;i<userLicenseDataAsInput.length;i++) {
                opt = document.createElement('option');
                opt.innerHTML = userLicenseDataAsInput[i].Name;
                opt.value = userLicenseDataAsInput[i].Id;
                fragment.appendChild(opt);
            }

            var userLicense_Select = $('#creatingUserLicenseddl');
            var length = userLicense_Select.children('option').length;
            if(length > 0 ) {
                userLicense_Select.empty();
            }

            $('#creatingUserLicenseddl').append(fragment);
        }
        catch(error) {
            console.log("error occured at addingUserLicenseNames: " + error);
        }
    },

    disablePSetDropDownListnEditBtn : function(){
        $('#permissionSetNamesddl').attr('disabled', 'disabled');
        $('#permissionSetEditBtn').attr('disabled', 'disabled');
    },

    enablePSetDropDownListnEditBtn : function(){
        $('#permissionSetNamesddl').removeAttr('disabled');
        $('#permissionSetEditBtn').removeAttr('disabled');
    },

    loadAllObjectsForCreateNew : function(component) {
        try {
            var action = component.get("c.getAllObjects");
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (component.isValid() && state === "SUCCESS") {
                    component.set("v.objectNames", response.getReturnValue());
                    component.set("v.allObjectDetails", "");
                    component.set("v.allObjectDetails", this.addObjDetailsToListofObjs(response.getReturnValue(), null));
                }
                else{
                    console.log('state: error');
                }
            });
            $A.enqueueAction(action);
        }
        catch(error) {
            console.log("error occured at loadAllObjectsForCreateNew: " + error);
        }
    },

    addObjDetailsToListofObjs : function(objDetailsFromServer, pSetId) {
        try {
            //NOTE:Add all the object details here
            //TODO: Adding Obj Details to the json (being used here as class)
            var allObjDetails = [];
            for(var i=0;i<objDetailsFromServer.length;i++) {
                //create Field Details Object
                // create Obj Permisisons Object
                if(Object.keys(objDetailsFromServer[i].objPermissions).length === 0) {
                    var objPermissionsAsObject = this.createObjPermissionsClass(null, false, false, false, false, false, false);
                }
                else{
                    var objPermissionsAsObject = this.createObjPermissionsClass(objDetailsFromServer[i].objPermissions.objPermissionsId,objDetailsFromServer[i].objPermissions.read, objDetailsFromServer[i].objPermissions.create, objDetailsFromServer[i].objPermissions.edit, objDetailsFromServer[i].objPermissions.deleteData, objDetailsFromServer[i].objPermissions.viewAll, objDetailsFromServer[i].objPermissions.modifyAll);
                }
                // create Obj Details Object
                allObjDetails.push(this.createObjDetailsClass(objDetailsFromServer[i].pluralLabel, objDetailsFromServer[i].label, objDetailsFromServer[i].name, objDetailsFromServer[i].key, pSetId, objPermissionsAsObject, null));
            }
            return allObjDetails;
        }
        catch(error) {
            console.log("Theres an error at addObjDetailsToListofObjs: " + error);
        }
    },

    loadallFieldsofIndividualObject : function(component, event) {
        try {
            var allObjectData = component.get("v.objectNames");
            if(!this.checkIfObjectRelatedFieldDataisPresent(event.srcElement.id, allObjectData)) {
                var action = component.get("c.getIndividualObjAllFieldData");
                action.setParams({ selectedObject : event.srcElement.id});
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (component.isValid() && state === "SUCCESS") {
                        if(response.getReturnValue() != null) {
                            for(var i=0;i<allObjectData.length;i++) {
                                if(allObjectData[i].key == event.srcElement.id) {
                                    if(allObjectData[i].fieldDetails == null) {
                                        allObjectData[i].fieldDetails = response.getReturnValue();
                                        component.set("v.objectNames",allObjectData);
                                        break;
                                    }
                                    else {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    else {
                        console.log('state: ' + response.getState());
                    }
                });
            }
            $A.enqueueAction(action);
        }
        catch(error) {
            console.log("error occured at loadallFieldsofIndividualObject: " + error);
        }
    },

    checkIf_create_New_PSet_Object_isEmpty : function(component) {
        var newPSetObj = component.get('{!v.createNewPSetObject}');
        if(newPSetObj == null){
            return true;
        }
        else {
            return false;
        }
    },

    creatingpSetNameChangeHelperCall : function(component, event) {
        try {
            var labelVal = $('#'+event.srcElement.id).val();
            var returnVal = this.checkConditionsWithPSetAPIName(component, null, labelVal);

            if(returnVal == false) {
                $('#'+event.srcElement.id).focus();
                $('#successorErrorMessageLabel').css('color', 'red');
                $('#successorErrorMessageLabel').html("There's an error");
            }
            else {
                $('#successorErrorMessageLabel').html("");
                $('#'+event.srcElement.id).val(returnVal);
                $('#creatingpSetAPIName').val(returnVal);
            }
        }
        catch(error) {
            console.log("error occured at creatingpSetNameChangeHelperCall: " + error);
        }
    },

    creatingUserLicenseddlChangeHelperCall : function(component, event) {
        // If this to be implemented, get it from previous code

        // var userLicense = $('#'+event.srcElement.id).val();
        // console.log('selected user License:' + userLicense);
    },

    creatingpSetAPINameChangeHelperCall : function(component, event) {
        try {
            var apiName = $('#'+event.srcElement.id).val();
            var returnVal = this.checkConditionsWithPSetAPIName(component, apiName, null);
            if(returnVal == false) {
                $('#'+event.srcElement.id).focus();
                $('#successorErrorMessageLabel').css('color', 'red');
                $('#successorErrorMessageLabel').html("There's an error");
            }
            else {
                $('#successorErrorMessageLabel').html("");
                $('#'+event.srcElement.id).val(returnVal);
            }
        }
        catch(error) {
            console.log("error at creatingpSetAPINameChangeHelperCall: " + error);
        }
    },

    creatingPSetDescriptionChangeHelperCall : function(component, event) {
        // If this to be implemented, get it from previous code
    },

    checkConditionsWithPSetAPIName : function(component, pSet_API_Name, pSet_Label) {
        try{
            var permissionsSetNames = JSON.stringify(component.get("{!v.pSetValuesForComparisions}"));
            if (pSet_API_Name != null && permissionsSetNames.toLowerCase().indexOf(pSet_API_Name.toLowerCase()) == -1) {
                var returnVal = this.checkForPatterns(pSet_API_Name);
                if(!returnVal) {
                    return false;
                }
                if(permissionsSetNames.toLowerCase().indexOf(returnVal.toLowerCase()) == -1){
                    return returnVal;
                }
                else {
                    return false;

                }
            }
            else if(pSet_Label != null && permissionsSetNames.toLowerCase().indexOf('"' + pSet_Label.toLowerCase() + '"') == -1) {
                var returnVal = this.checkForPatterns(pSet_Label);
                if(!returnVal) {
                    return false;
                }
                if(permissionsSetNames.toLowerCase().indexOf('"' + returnVal.toLowerCase() + '"') == -1) {
                    return returnVal;
                }
                else {
                    return false;
                }
            }
            else{
                return false;
            }
        }
        catch(error) {
            console.log("error at checkConditionsWithPSetAPIName: " + error);
        }
    },

    checkForPatterns : function(inputString) {
        try{
            var pattern_For_SpecialChars = /^[\w&.\-]+$/;
            var pattern_ToCheck_If_It_Starts_With_Letter = /[a-zA-Z_]/;
            var pattern_Should_Not_EndWith_Underscore = /[_]/;
            var pattern_ToCheck_If_ThereAre_Consecutive_Underscores = /^([^_]*(_[^_])?)*_?$/;

            //trim
            inputString = inputString.trim(inputString);

            //replace any space with '_'
            inputString = inputString.split(' ').join('_');

            if(
                pattern_For_SpecialChars.test(inputString)
                && pattern_ToCheck_If_It_Starts_With_Letter.test(inputString[0])
                && (!pattern_Should_Not_EndWith_Underscore.test(inputString[inputString.length - 1]))
                && pattern_ToCheck_If_ThereAre_Consecutive_Underscores.test(inputString)
            ) {
                return inputString;
            }
            else {
                return false;
            }
        }
        catch(error) {
            console.log("error occured at checkForPatterns: " + error);
        }
    },

    //END

    permissionSetClearChangesHelperCall : function() {
        //clear click
        try {
            $('#mainDivForAllSubDivs').slideUp('slow');
            $('#creatingNewPermissionSetDetails').slideUp('slow');
            $('#PermissionSetDetailsDiv').show();
            this.enablePSetDropDownListnEditBtn();
        }
        catch(error) {
            console.log("error occured at permissionSetClearChangesHelperCall: " + error);
        }
    },

    openFieldsDetailsHelperCall: function(cmp,event) {
        try{
            var createNew_isClicked = cmp.get("{!v.checkIfCreatedIsClicked}");

            if($('#'+event.srcElement.id).val() == '+') {
                if(createNew_isClicked == null) {
                    this.contactServerForFieldswithPermissions(cmp, event);
                }
                else {
                    this.loadallFieldsofIndividualObject(cmp, event);
                }
                $('#'+event.srcElement.id).val('-');
                $('#'+event.srcElement.id + 'fieldDiv').show('slow');
            }
            else {
                $('#'+event.srcElement.id).val('+');
                $('#'+event.srcElement.id + 'fieldDiv').slideUp('slow');
            }
        }
        catch(error) {
            console.log("error occured at openFieldsDetailsHelperCall: " + error);
        }
    },

    contactServerForFieldswithPermissions: function(component, event) {
        //get global stored objs data
        var objName = event.srcElement.id;
        var allObjectData = component.get("v.objectNames");
        if(!this.checkIfObjectRelatedFieldDataisPresent(objName, allObjectData)) {
            this.getFieldswithPermissions(component, objName);
        }
    },

    getFieldswithPermissions : function(component, objNameasInput) {
        try {
            var allObjectData = component.get("v.objectNames");
            //if(!this.checkIfObjectRelatedFieldDataisPresent(objNameasInput, allObjectData)) {
                var action = component.get("c.getAllFieldDataWithPermissions");
                action.setParams({ objName : objNameasInput, pSetId : $('#permissionSetNamesddl').val() });
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (component.isValid() && state === "SUCCESS") {
                        if(response.getReturnValue() != null) {
                            var fieldDetailsWithPermissionsasJSON = JSON.stringify(response.getReturnValue());
                            if(!this.checkIfDataHasRequiredString(fieldDetailsWithPermissionsasJSON, '"fieldRead":false')){
                                // make all read true
                                $('#' + objNameasInput + 'readForAllFieldsofanIndividualObj').prop('checked',true);
                            }
                            if(!this.checkIfDataHasRequiredString(fieldDetailsWithPermissionsasJSON, '"fieldEdit":false')){
                                // make all edit true
                                $('#' + objNameasInput + 'editForAllFieldsofanIndividualObj').prop('checked',true);
                            }
                            for(var i=0; i<allObjectData.length; i++) {
                                if(allObjectData[i].key == objNameasInput) {
                                    if(allObjectData[i].fieldDetails == null) {
                                        allObjectData[i].fieldDetails = response.getReturnValue();
                                        var fieldDetails = [];
                                        for(var fieldCount = 0; fieldCount<allObjectData[i].fieldDetails.length; fieldCount++) {
                                            var fieldPermissionsConcerningObjnPSet = this.createFieldPermissionsClass(allObjectData[i].fieldDetails[fieldCount].fieldPermissions.fieldPermissionsId, allObjectData[i].fieldDetails[fieldCount].fieldPermissions.fieldRead, allObjectData[i].fieldDetails[fieldCount].fieldPermissions.fieldEdit);
                                            var fieldDetailsObj = this.createFieldDetailsClass(allObjectData[i].fieldDetails[fieldCount].fieldName, allObjectData[i].fieldDetails[fieldCount].fieldLabel, fieldPermissionsConcerningObjnPSet);
                                            fieldDetails.push(fieldDetailsObj);
                                        }
                                        component.set("v.objectNames",allObjectData);
                                        break;
                                    }
                                    else {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    else if(state === "ERROR"){
                        console.log("There's an error at getFieldswithPermissions: " + response.getError());
                    }
                });
                $A.enqueueAction(action);
            //}
        }
        catch(error) {
            console.log("error occured at getFieldswithPermissions: " + error);
        }
    },

    checkIfObjectRelatedFieldDataisPresent : function(selectedObjKey, allObjData) {
        try{
            var returnVal = false;
            // if(allObjData)
            for(var i=0;i<allObjData.length;i++) {
                if(allObjData[i].key == selectedObjKey && allObjData[i].fieldDetails != null) {
                    returnVal = true;
                    break;
                }
            }
            return returnVal;
        }
        catch(error) {
            console.log("error at checkIfObjectRelatedFieldDataisPresent: " + error);
        }
    },

    opennCloseEditPermissionsonAllObjs : function(cmp, event) {
        try{
            this.swapPlusandMinusButton('PointerForEditPermissionsonAllObjs','editPermissionsonAllObjs');
        }
        catch(error) {
            console.log("error at opennCloseEditPermissionsonAllObjs: " + error);
        }
    },

    opennCloseEditPermissionsonAllFieldsofAllObjs : function(cmp, event) {
        try{
            this.swapPlusandMinusButton('PointerForEditPermissionsonAllFieldsofAllObjs','editPermissionsonAllFieldsofAllObjs');
        }
        catch(error) {
            console.log("error at opennCloseEditPermissionsonAllFieldsofAllObjs: " + error);
        }
    },

    //NOTE: In the below method used static values to pass CSS class.
    //In next version, will write all static values in a class and acceess from there

    opennCloseEditPermissionsonIndividualObjectsandFieldsHelperCall : function(cmp, event) {
        this.opennCloseEdit(cmp);
    },

    opennCloseEdit : function(cmp) {
        //check if create new is clicked?
        try{
            var createNew_isClicked = cmp.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                this.swapPlusandMinusButton('PointerForEditPermissionsonIndividualObjectsandFields','editPermissionsonIndividualObjectsandFields');
                //change the expand object button value
                var allObjsDataForChangingExpandBtnValue = cmp.get("{!v.objectNames}");
                var edit_isClicked = cmp.get("{!v.checkIfEditIsClicked}");
                for(var objClass = 0;objClass < allObjsDataForChangingExpandBtnValue.length; objClass++) {
                    $('#' + allObjsDataForChangingExpandBtnValue[objClass].key).val('+');
                    if(edit_isClicked == null) {
                        this.disablingObjectLevelPermissions(allObjsDataForChangingExpandBtnValue[objClass].key);
                    }
                }
            }
            else {
                // Assigining '+' to all Objects
                var allObjsDataForChangingExpandBtnValue = cmp.get("{!v.objectNames}");
                for(var objClass = 0;objClass < allObjsDataForChangingExpandBtnValue.length; objClass++) {
                    $('#' + allObjsDataForChangingExpandBtnValue[objClass].key).val('+');
                }

                // make all checkboxes un check
                // open 'editPermissionsonIndividualObjectsandFields' div
                this.swapPlusandMinusButton('PointerForEditPermissionsonIndividualObjectsandFields','editPermissionsonIndividualObjectsandFields');
            }

        }
        catch(error) {
            console.log("error at opennCloseEditPermissionsonIndividualObjectsandFieldsHelperCall: " + error);
        }
    },

    //common methods
    swapPlusandMinusButton : function(elementNameForPointer, displayElementName) {
        try{
            if($('#'+ elementNameForPointer).val() == '+'){
                $('#'+ displayElementName).show('slow');
                $('#'+ elementNameForPointer).val('-');
                return '+';

            }
            else if($('#'+ elementNameForPointer).val() == '-'){
                $('#'+ displayElementName).slideUp('slow');
                $('#'+ elementNameForPointer).val('+');
                return '-';
            }
        }
        catch(error) {
            console.log("error at swapPlusandMinusButton: " + error);
        }
    },

    //NOTE: Enabling and Disabling

    methodToDisableEveryInputHelperCall : function(component, event) {
        try{
            var spinner = component.find('spinner');
            var evt = spinner.get("e.toggle");
            evt.setParams({ isVisible : false });
            evt.fire();
        }
        catch(error) {
            console.log("error at methodToDisableEveryInputHelperCall: " + error);
        }
    },

    disablingEverything : function() {
        try{
            $(':input').attr('disabled', 'disabled');
            $("input:checkbox").attr('disabled', 'disabled');
            $('#permissionSetEditBtn').removeAttr('disabled');
            $('#permissionSetCreateNewBtn').removeAttr('disabled');
            $('#permissionSetSaveBtn').removeAttr('disabled');
            $('#permissionSetSaveBtn').removeAttr('disabled');
            $('#PointerForEditPermissionsonIndividualObjectsandFields').removeAttr('disabled');
            $('#PointerForEditPermissionsonAllFieldsofAllObjs').removeAttr('disabled');
            $('#permissionSetNamesddl').removeAttr('disabled');
        }
        catch(error) {
            console.log("error at disablingEverything: " + error);
        }
    },

    enablingEverything : function() {
        try{
            $(':input').removeAttr('disabled');
            $('#permissionSetCloneBtn').attr('disabled', 'disabled');
            $('#readForAllFieldsOfAllObjs').attr('disabled', 'disabled');
            $('#editForAllFieldsOfAllObjs').attr('disabled', 'disabled');
        }
        catch(error) {
            console.log("error at enablingEverything: " + error);
        }
    },

    disablingObjectLevelPermissions : function(objKey) {
        try {
            $('#' + objKey + 'ObjRead').attr('disabled', 'disabled');
            $('#' + objKey + 'ObjCreate').attr('disabled', 'disabled');
            $('#' + objKey + 'ObjEdit').attr('disabled', 'disabled');
            $('#' + objKey + 'ObjDelete').attr('disabled', 'disabled');
            $('#' + objKey + 'ObjViewAll').attr('disabled', 'disabled');
            $('#' + objKey + 'ObjModifyAll').attr('disabled', 'disabled');
        }
        catch(error) {
            console.log("error at disablingObjectLevelPermissions: " + error);
        }
    },

    enablingObjectLevelPermissions : function(objKey) {
        try{
            $('#' + objKey + 'ObjRead').removeAttr('disabled');
            $('#' + objKey + 'ObjCreate').removeAttr('disabled');
            $('#' + objKey + 'ObjEdit').removeAttr('disabled');
            $('#' + objKey + 'ObjDelete').removeAttr('disabled');
            $('#' + objKey + 'ObjViewAll').removeAttr('disabled');
            $('#' + objKey + 'ObjModifyAll').removeAttr('disabled');
        }
        catch(error) {
            console.log("error at enablingObjectLevelPermissions: " + error);
        }

    },

    enablingFieldLevelPermissions : function(objKey, fieldDetailsConcerningSingleObject) {
        try {
            $('#' + objKey + 'readForAllFieldsofanIndividualObj').removeAttr('disabled');
            $('#' + objKey + 'editForAllFieldsofanIndividualObj').removeAttr('disabled');
            for(var fieldData = 0;fieldData < fieldDetailsConcerningSingleObject.length; fieldData++) {
                $('#' +fieldDetailsConcerningSingleObject[fieldData].fieldName + 'indiFieldRead').removeAttr('disabled');
                $('#' +fieldDetailsConcerningSingleObject[fieldData].fieldName + 'indiFieldEdit').removeAttr('disabled');
            }
        }
        catch(error) {
            console.log("error at enablingFieldLevelPermissions: " + error);
        }
    },

    //NOTE: METHODS to SAVE OBJECT Level Permission Changes INDIVIDUAL

    individualObjectReadPermissionServerCall : function(cmpt, event) {
        //individual Object Read Permission
        try{
            var createNew_isClicked = cmpt.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val() ,'Object', event.srcElement.value, null);
            }
            else {
                this.updateChangesinObjorFieldPermissions(cmpt, null, 'Object', event.srcElement.value, null);
            }
            var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "read", $('#'+event.srcElement.id).is(':checked'));
            cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
            cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);
        }
        catch(error) {
            console.log("error at individualObjectReadPermissionServerCall: " + error);
        }
    },

    individualObjectCreatePermissionServerCall : function(cmpt, event) {
        ////individual Object Create Permission
        try{
            var createNew_isClicked = cmpt.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val() ,'Object', event.srcElement.value, null);
            }
            else {
                this.updateChangesinObjorFieldPermissions(cmpt, null, 'Object', event.srcElement.value, null);
            }
            var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "create", $('#'+event.srcElement.id).is(':checked'));
            cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
            cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);
        }
        catch(error) {
            console.log("error at individualObjectCreatePermissionServerCall: " + error);
        }
    },

    individualObjectEditPermissionServerCall : function(cmpt, event) {
        //individual Object Edit Permission
        try {
            var createNew_isClicked = cmpt.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val() ,'Object', event.srcElement.value, null);
            }
            else {
                this.updateChangesinObjorFieldPermissions(cmpt, null, 'Object', event.srcElement.value, null);
            }
            var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "edit", $('#'+event.srcElement.id).is(':checked'));
            cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
            cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);
        }
        catch(error) {
            console.log("error at individualObjectEditPermissionServerCall: " + error);
        }
    },

    individualObjectDeletePermissionServerCall : function(cmpt, event) {
        //individual Object Delete Permission
        try{
            var createNew_isClicked = cmpt.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val(),'Object', event.srcElement.value, null);
            }
            else {
                this.updateChangesinObjorFieldPermissions(cmpt, null,'Object', event.srcElement.value, null);
            }
            var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "deleteData", $('#'+event.srcElement.id).is(':checked'));
            cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
            cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);
        }
        catch(error) {
            console.log("error at individualObjectDeletePermissionServerCall: " + error);
        }
    },

    individualObjectViewAllPermissionServerCall : function(cmpt, event) {
        //individual Object View All Permission
        try{
            var createNew_isClicked = cmpt.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val(),'Object', event.srcElement.value, null);
            }
            else {
                this.updateChangesinObjorFieldPermissions(cmpt, null, 'Object', event.srcElement.value, null);
            }
            var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "viewAll", $('#'+event.srcElement.id).is(':checked'));
            cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
            cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);
        }
        catch(error) {
            console.log("error at individualObjectViewAllPermissionServerCall: " + error);
        }
    },

    individualObjectModifyAllPermissionServerCall : function(cmpt, event) {

        //individual Object ModifyAll Permission
        try{
            var createNew_isClicked = cmpt.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val(),'Object', event.srcElement.value, null);
            }
            else {
                this.updateChangesinObjorFieldPermissions(cmpt, null,'Object', event.srcElement.value, null);
            }
            var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "modifyAll", $('#'+event.srcElement.id).is(':checked'));
            cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
            cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);
        }
        catch(error) {
            console.log("error at individualObjectModifyAllPermissionServerCall: " + error);
        }

    },

    handleAllIndividualObjPermissionsCheckBox : function(allObjsDataForHandlingIndiObjPermissions, selectedPermissionObjKey, typeOfPermission, trueOrfalse) {
        try{
            for(var objCount = 0; objCount<allObjsDataForHandlingIndiObjPermissions.length ; objCount++) {
                if(allObjsDataForHandlingIndiObjPermissions[objCount].key == selectedPermissionObjKey) {
                    if(typeOfPermission == "read") {
                        if(trueOrfalse) {
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = true;
                        }
                        else {
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = false;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.create = false;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.edit = false;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.deleteData = false;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.viewAll = false;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.modifyAll = false;
                        }
                    }
                    else if(typeOfPermission == "create") {
                        if(trueOrfalse){
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.create = true;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = true;
                        }
                        else {
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.create = false;
                        }
                    }
                    else if(typeOfPermission == "edit") {
                        if(trueOrfalse){
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.edit = true;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = true;
                        }
                        else {
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.edit = false;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.deleteData = false;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.modifyAll = false;
                        }
                    }
                    else if(typeOfPermission == "deleteData") {
                        if(trueOrfalse){
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.deleteData = true;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.edit = true;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = true;
                        }
                        else {
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.deleteData = false;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.modifyAll = false;
                        }
                    }
                    else if(typeOfPermission == "viewAll") {
                        if(trueOrfalse){
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.viewAll = true;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = true;
                        }
                        else {
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.viewAll = false;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.modifyAll = false;
                        }
                    }
                    else if(typeOfPermission == "modifyAll") {
                        if(trueOrfalse){
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.modifyAll = true;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.deleteData = true;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.edit = true;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = true;
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.viewAll = true;
                        }
                        else {
                            allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.modifyAll = false;
                        }
                    }

                }
            }

            return allObjsDataForHandlingIndiObjPermissions;
        }
        catch(error) {
            console.log("error at handleAllIndividualObjPermissionsCheckBox: " + error);
            return null;
        }
    },

    //NOTE: METHODS to SAVE OBJECT Level Permission Changes FOR ALL

    readforAllObjsChkBoxClickServerCall : function(cmp, event) {
        // read for All Objs Check box
        // check read = true for all objs
        //readforAllObjsChkBox
        try {
            var allObjects = cmp.get("{!v.objectNames}");
            if($('#'+event.srcElement.id).is(':checked')) {
                for(var i=0;i<allObjects.length;i++) {
                    allObjects[i].objPermissions.read = true;
                }
            }
            else {
                for(var i=0;i<allObjects.length;i++) {
                    allObjects[i].objPermissions.read = false;
                    allObjects[i].objPermissions.create = false;
                    allObjects[i].objPermissions.edit = false;
                    allObjects[i].objPermissions.deleteData = false;
                    allObjects[i].objPermissions.viewAll = false;
                    allObjects[i].objPermissions.modifyAll = false;
                }
                $('#createforAllObjsChkBox').prop('checked',false);
                $('#editforAllObjsChkBox').prop('checked',false);
                $('#deleteforAllObjsChkBox').prop('checked',false);
                $('#viewAllforAllObjsChkBox').prop('checked',false);
                $('#modifyAllforAllObjsChkBox').prop('checked',false);
            }
            cmp.set("v.objectNames",allObjects);
            cmp.set("v.changedAllObjectDetails", allObjects);
            var createNew_isClicked = cmp.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);
            }
            else {
                this.updateChangesinObjorFieldPermissions(cmp, null ,'Object', 'Allqwerty', null);
            }
        }
        catch(error) {
            console.log("error occured at readforAllObjsChkBoxClickServerCall: " + error);
        }
    },

    createforAllObjsChkBoxClickServerCall : function(cmp, event) {
        // check create = true for all objs
        try{
            var allObjects = cmp.get("{!v.objectNames}");
            if($('#'+event.srcElement.id).is(':checked')) {
                for(var i=0;i<allObjects.length;i++) {
                    allObjects[i].objPermissions.create = true;
                    allObjects[i].objPermissions.read = true;
                    $('#readforAllObjsChkBox').prop('checked',true);
                }
            }
            else {
                for(var i=0;i<allObjects.length;i++) {
                    allObjects[i].objPermissions.create = false;
                }
            }
            cmp.set("v.objectNames",allObjects);
            cmp.set("v.changedAllObjectDetails", allObjects);
            var createNew_isClicked = cmp.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);
            }
            else {
                this.updateChangesinObjorFieldPermissions(cmp, null ,'Object', 'Allqwerty', null);
            }
        }
        catch(error) {
            console.log("error occured at createforAllObjsChkBoxClickServerCall: " + error);
        }
    },

    editforAllObjsChkBoxClickServerCall : function(cmp, event) {
        // check edit = true for all
        try{
            var allObjects = cmp.get("{!v.objectNames}");
            if($('#'+event.srcElement.id).is(':checked')) {

                for(var i=0;i<allObjects.length;i++) {
                    allObjects[i].objPermissions.edit = true;
                    allObjects[i].objPermissions.read = true;
                }
                $('#readforAllObjsChkBox').prop('checked',true);
            }
            else {

                for(var i=0;i<allObjects.length;i++) {
                    allObjects[i].objPermissions.edit = false;
                    allObjects[i].objPermissions.deleteData = false;
                    allObjects[i].objPermissions.modifyAll = false;
                }
                $('#modifyAllforAllObjsChkBox').prop('checked',false);
                $('#deleteforAllObjsChkBox').prop('checked',false);
            }
            cmp.set("v.objectNames",allObjects);
            cmp.set("v.changedAllObjectDetails", allObjects);
            var createNew_isClicked = cmp.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);
            }
            else {
                this.updateChangesinObjorFieldPermissions(cmp, null ,'Object', 'Allqwerty', null);
            }
        }
        catch(error) {
            console.log("error occured at editforAllObjsChkBoxClickServerCall: " + error);
        }
    },

    deleteforAllObjsChkBoxClickServerCall : function(cmp, event) {
        // check delete = true for all objs
        try{
            var allObjects = cmp.get("{!v.objectNames}");
            if($('#'+event.srcElement.id).is(':checked')) {
                for(var i=0;i<allObjects.length;i++) {
                    allObjects[i].objPermissions.deleteData = true;
                    allObjects[i].objPermissions.read = true;
                    allObjects[i].objPermissions.edit = true;
                }
                $('#readforAllObjsChkBox').prop('checked',true);
                $('#editforAllObjsChkBox').prop('checked',true);
            }
            else {
                for(var i=0;i<allObjects.length;i++) {
                    allObjects[i].objPermissions.deleteData = false;
                    allObjects[i].objPermissions.modifyAll = false;
                }
                $('#modifyAllforAllObjsChkBox').prop('checked',false);
            }
            cmp.set("v.objectNames",allObjects);
            cmp.set("v.changedAllObjectDetails", allObjects);
            var createNew_isClicked = cmp.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);
            }
            else {
                this.updateChangesinObjorFieldPermissions(cmp, null ,'Object', 'Allqwerty', null);
            }
        }
        catch(error) {
            console.log("error occured at deleteforAllObjsChkBoxClickServerCall: " + error);
        }

    },

    viewAllforAllObjsChkBoxClickServerCall : function(cmp, event) {
        // check viewAll = true for all objs
        try {
            var allObjects = cmp.get("{!v.objectNames}");
            if($('#'+event.srcElement.id).is(':checked')) {
                for(var i=0;i<allObjects.length;i++) {
                    allObjects[i].objPermissions.viewAll = true;
                    allObjects[i].objPermissions.read = true;
                }
                $('#readforAllObjsChkBox').prop('checked',true);
            }
            else {
                for(var i=0;i<allObjects.length;i++) {
                    allObjects[i].objPermissions.viewAll = false;
                    allObjects[i].objPermissions.modifyAll = false;
                }
                $('#modifyAllforAllObjsChkBox').prop('checked',false);
                //}
            }
            cmp.set("v.objectNames",allObjects);
            cmp.set("v.changedAllObjectDetails", allObjects);
            var createNew_isClicked = cmp.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);
            }
            else {
                this.updateChangesinObjorFieldPermissions(cmp, null ,'Object', 'Allqwerty', null);
            }
        }
        catch(error) {
            console.log("error occured at viewAllforAllObjsChkBoxClickServerCall: " + error);
        }

    },

    modifyAllforAllObjsChkBoxClickServerCall : function(cmp, event) {
        // check modifyAll = true for all objs
        try {
            var allObjects = cmp.get("{!v.objectNames}");
            if($('#'+event.srcElement.id).is(':checked')) {
                for(var i=0;i<allObjects.length;i++) {
                    allObjects[i].objPermissions.modifyAll = true;
                    allObjects[i].objPermissions.read = true;
                    allObjects[i].objPermissions.edit = true;
                    allObjects[i].objPermissions.deleteData = true;
                    allObjects[i].objPermissions.viewAll = true;
                }
                $('#readforAllObjsChkBox').prop('checked',true);
                $('#editforAllObjsChkBox').prop('checked',true);
                $('#deleteforAllObjsChkBox').prop('checked',true);
                $('#viewAllforAllObjsChkBox').prop('checked',true);
            }
            else {
                for(var i=0;i<allObjects.length;i++) {
                    allObjects[i].objPermissions.modifyAll = false;
                }
            }
            cmp.set("v.objectNames",allObjects);
            cmp.set("v.changedAllObjectDetails", allObjects);
            var createNew_isClicked = cmp.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);
            }
            else {
                this.updateChangesinObjorFieldPermissions(cmp, null ,'Object', 'Allqwerty', null);
            }
        }
        catch(error) {
            console.log("error occured at modifyAllforAllObjsChkBoxClickServerCall: " + error);
        }

    },

    //NOTE: METHODS to SAVE FIELD Level Permission Changes

    readForAllFieldsofanIndividualObjClickHelperCall : function(cmp,event) {
        try{
            var createNew_isClicked = cmp.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                this.updateChangesinObjorFieldPermissions(cmp,$('#permissionSetNamesddl').val(), 'Field', event.srcElement.name, 'Allqwerty');
            }
            else {
                this.updateChangesinObjorFieldPermissions(cmp, null, 'Field', event.srcElement.name, 'Allqwerty');
            }
            var allObjDataForFieldsData = cmp.get("{!v.objectNames}");
            if($('#' + event.srcElement.id).is(':checked')) {
                var allObjDataForFieldsDataAfterAllChanges = this.implementCheckboxManipulationforAllFields(allObjDataForFieldsData, event.srcElement.name, 'read', true);
                cmp.set("v.objectNames", allObjDataForFieldsDataAfterAllChanges);
                cmp.set("v.changedAllObjectDetails", allObjDataForFieldsDataAfterAllChanges);
            }
            else {
                var allObjDataForFieldsDataAfterAllChanges = this.implementCheckboxManipulationforAllFields(allObjDataForFieldsData, event.srcElement.name, 'read', false);
                var allObjDataForFieldsDataAfterAllChanges = this.implementCheckboxManipulationforAllFields(allObjDataForFieldsDataAfterAllChanges, event.srcElement.name, 'edit', false);
                $('#' + event.srcElement.name + 'editForAllFieldsofanIndividualObj').prop('checked', false);

                cmp.set("v.objectNames", allObjDataForFieldsDataAfterAllChanges);
                cmp.set("v.changedAllObjectDetails", allObjDataForFieldsDataAfterAllChanges);
            }
        }
        catch(error){
            console.log("error at readForAllFieldsofanIndividualObjClickHelperCall: " + error);
        }
    },

    editForAllFieldsofanIndividualObjClickHelperCall : function(cmp,event) {
        try{
            var createNew_isClicked = cmp.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                this.updateChangesinObjorFieldPermissions(cmp,$('#permissionSetNamesddl').val(), 'Field', event.srcElement.name, 'Allqwerty');
            }
            else {
                this.updateChangesinObjorFieldPermissions(cmp, null, 'Field', event.srcElement.name, 'Allqwerty');
            }
            var allObjDataForFieldsData = cmp.get("{!v.objectNames}");
            if($('#' + event.srcElement.id).is(':checked')) {
                var allObjDataForFieldsDataAfterAllChanges = this.implementCheckboxManipulationforAllFields(allObjDataForFieldsData, event.srcElement.name, 'edit', true);
                var allObjDataForFieldsDataAfterAllChanges = this.implementCheckboxManipulationforAllFields(allObjDataForFieldsDataAfterAllChanges, event.srcElement.name, 'read', true);
                cmp.set("v.objectNames", allObjDataForFieldsDataAfterAllChanges);
                cmp.set("v.changedAllObjectDetails", allObjDataForFieldsDataAfterAllChanges);
                $('#' + event.srcElement.name + 'readForAllFieldsofanIndividualObj').prop('checked', true);
            }
            else {
                var allObjDataForFieldsDataAfterAllChanges = this.implementCheckboxManipulationforAllFields(allObjDataForFieldsData, event.srcElement.name, 'edit', false);
                cmp.set("v.objectNames", allObjDataForFieldsDataAfterAllChanges);
                cmp.set("v.changedAllObjectDetails", allObjDataForFieldsDataAfterAllChanges);
            }
        }
        catch(error){
            console.log("error at editForAllFieldsofanIndividualObjClickHelperCall: " + error);
        }
    },

    readForanIndividualFieldofAnIndividualObjClickHelperCall : function(cmp,event) {
        //Individual Obj Read Permissions Click
        // get field Label (which is combo of event.srcElement.id + 'indiFieldRead') with event.srcElement.id
        // compare it with looping through the list of fieldDetails
        // true the required Read value and you are good to go

        try {
            var createNew_isClicked = cmp.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val(), 'Field', event.srcElement.name, event.srcElement.value);
            }
            else {
                this.updateChangesinObjorFieldPermissions(cmp, null,'Field', event.srcElement.name, event.srcElement.value);
            }
            var allObjsDataforIndividualField = this.implementCheckboxManipulationforIndividualField(cmp.get("{!v.objectNames}"), event.srcElement.name, event.srcElement.value, "read", $('#' + event.srcElement.id).is(':checked'));
            cmp.set("v.objectNames", allObjsDataforIndividualField);
            cmp.set("v.changedAllObjectDetails", allObjsDataforIndividualField);
        }
        catch(error) {
            console.log("error at readForanIndividualFieldofAnIndividualObjClickHelperCall: " + error);
        }

    },

    editForanIndividualFieldofAnIndividualObjClickHelperCall : function(cmp, event) {
        try {
            //Individual Obj Edit Permissions Click
            var createNew_isClicked = cmp.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Field', event.srcElement.name, event.srcElement.value);
            }
            else {
                this.updateChangesinObjorFieldPermissions(cmp, null,'Field', event.srcElement.name, event.srcElement.value);
            }
            var allObjsDataforIndividualField = this.implementCheckboxManipulationforIndividualField(cmp.get("{!v.objectNames}"), event.srcElement.name, event.srcElement.value, "edit", $('#' + event.srcElement.id).is(':checked'));
            cmp.set("v.objectNames", allObjsDataforIndividualField);
            cmp.set("v.changedAllObjectDetails", allObjsDataforIndividualField);
        }
        catch(error) {
            console.log("error at editForanIndividualFieldofAnIndividualObjClickHelperCall: " + error);
        }
    },

    implementCheckboxManipulationforAllFields : function(allObjDataForFieldsData, objectkey, readOredit, trueOrfalse) {
        try{
            for(var i = 0; i < allObjDataForFieldsData.length; i++) {
                if(allObjDataForFieldsData[i].key == objectkey) {
                    for(var j=0;j<allObjDataForFieldsData[i].fieldDetails.length;j++) {
                        if(readOredit == 'read' && trueOrfalse) {
                            allObjDataForFieldsData[i].fieldDetails[j].fieldPermissions.fieldRead = true;
                        }
                        else if(readOredit == 'read' && (!trueOrfalse)) {
                            allObjDataForFieldsData[i].fieldDetails[j].fieldPermissions.fieldRead = false;
                        }
                        else if(readOredit == 'edit' && trueOrfalse) {
                            allObjDataForFieldsData[i].fieldDetails[j].fieldPermissions.fieldEdit = true;
                        }
                        else if(readOredit == 'edit' && (!trueOrfalse)) {
                            allObjDataForFieldsData[i].fieldDetails[j].fieldPermissions.fieldEdit = false;
                        }
                    }
                    break;
                }
            }
            return allObjDataForFieldsData;
        }
        catch(error) {
            console.log("error at implementCheckboxManipulationforAllFields: " + error);
        }
    },

    //NOTE: Implementing Individual Field Read/Edit CheckBox

    implementCheckboxManipulationforIndividualField : function(allObjsNamesForIndiFieldData, indiCheckBoxNameForObjKey, indiCheckBoxValueForFieldLabel, readOredit, trueOrfalse) {

        try{
            for(var objCount = 0; objCount < allObjsNamesForIndiFieldData.length; objCount++) {
                if(allObjsNamesForIndiFieldData[objCount].key == indiCheckBoxNameForObjKey) {
                    for(var fieldCount = 0;fieldCount < allObjsNamesForIndiFieldData[objCount].fieldDetails.length; fieldCount++) {
                        if(allObjsNamesForIndiFieldData[objCount].fieldDetails[fieldCount].fieldLabel == indiCheckBoxValueForFieldLabel) {
                            if(readOredit == "read" && trueOrfalse == true) {
                                allObjsNamesForIndiFieldData[objCount].fieldDetails[fieldCount].fieldPermissions.fieldRead = true;
                            }
                            else if(readOredit == "read" && trueOrfalse == false) {
                                if(allObjsNamesForIndiFieldData[objCount].fieldDetails[fieldCount].fieldPermissions.fieldEdit == false) {
                                    allObjsNamesForIndiFieldData[objCount].fieldDetails[fieldCount].fieldPermissions.fieldRead = false;
                                }
                            }
                            if(readOredit == "edit" && trueOrfalse == true) {
                                allObjsNamesForIndiFieldData[objCount].fieldDetails[fieldCount].fieldPermissions.fieldRead = true;
                                allObjsNamesForIndiFieldData[objCount].fieldDetails[fieldCount].fieldPermissions.fieldEdit = true;
                            }
                            if(readOredit == "edit" && trueOrfalse == false) {
                                allObjsNamesForIndiFieldData[objCount].fieldDetails[fieldCount].fieldPermissions.fieldEdit = false;
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            return allObjsNamesForIndiFieldData;
        }
        catch(error) {
            console.log("error at implementCheckboxManipulationforIndividualField: " + error);
        }
    },

    //NOTE: Creating of All Objects for: PermissionSet Details Class, Object Details Class and Field Details Class

    createAPermissionSetDetailsClass : function(label, pSetName, pSetId, pSetDescription, pSetNameSpacePrefix, pSetULicense, pSetCreatedDate) {
        try{
            var PermissionSetDetails = {
                label : label,
                apiName : pSetName,
                id : pSetId,
                description : pSetDescription,
                namespacePrefix : pSetNameSpacePrefix,
                userLicenseId : pSetULicense,
                createdDate : pSetCreatedDate
            }
            return PermissionSetDetails;
        }
        catch(error) {
            console.log("error at createAPermissionSetDetailsClass: " + error);
        }
    },

    createObjDetailsClass : function(objpluralLabel, objLabel, objName, objKey, pSetId, objPermissions, fieldDetails) {
        try {
            var objDetails = {
                pluralLabel : objpluralLabel,
                label : objLabel,
                name : objName,
                key : objKey,
                pSetId : pSetId,
                objPermissions : objPermissions,
                fieldDetails : fieldDetails
            }

            return objDetails;
        }
        catch(error) {
            console.log("error at createObjDetailsClass: " + error);
        }
    },

    createObjPermissionsClass : function(objPermissionId, objRead, objCreate, objEdit, objDelete, objviewAll, objmodifyAll) {
        try {
            var objPermissions = {
                objPermissionId : objPermissionId,
                read : objRead,
                create : objCreate,
                edit : objEdit,
                delete : objDelete,
                viewAll : objviewAll,
                modifyAll : objmodifyAll
            }

            return objPermissions;
        }
        catch(error) {
            console.log("error at createObjPermissionsClass: " + error);
        }
    },

    createFieldPermissionsClass : function(fieldPermissionsId, fieldRead, fieldEdit) {
        try {
            var fieldPermisisons = {
                fieldPermissionsId : fieldPermissionsId,
                fieldRead : fieldRead,
                fieldEdit : fieldEdit
            }

            return fieldPermisisons;
        }
        catch(error) {
            console.log("error at createFieldPermissionsClass: " + error);
        }
    },

    createFieldDetailsClass : function(fieldName, fieldLabel, fieldPermissions) {
        try {
            var fieldDetails = {
                fieldName : fieldName,
                fieldLabel : fieldLabel,
                fieldPermissions : fieldPermissions
            }
            return fieldDetails;
        }
        catch(error) {
            console.log("error at createFieldDetailsClass: " + error);
        }
    },

    //NOTE: Save For any changes

    pSetChangesSave : function(cmp, event) {
        try {
            var createNew_isClicked = cmp.get("{!v.checkIfCreatedIsClicked}");
            if(createNew_isClicked == null) {
                var changedRecordedObj =  cmp.get("{!v.changedRecordedObj}");
                if(changedRecordedObj != null) {
                    var pSetDetailsObj = cmp.get("{!v.text}");
                    var objFieldData = cmp.get("{!v.changedAllObjectDetails}");
                    var action = cmp.get("c.savePSetDetailsChanges");
                    var changedRecordedObjasJson;
                    var pSetDetailsObjasJson;
                    var objFieldDataasJson;

                    changedRecordedObjasJson = JSON.stringify(changedRecordedObj);
                    if(pSetDetailsObj) {
                        pSetDetailsObjasJson = JSON.stringify(pSetDetailsObj);
                    }
                    else {
                        pSetDetailsObjasJson = null;
                    }
                    if(objFieldData != null) {
                        objFieldDataasJson = JSON.stringify(objFieldData);
                    }
                    else {
                        objFieldDataasJson = null;
                    }

                    action.setParams({ changesRecordedObj : changedRecordedObjasJson, changedPSetData : pSetDetailsObjasJson, changedObjData : objFieldDataasJson });

                    action.setCallback(this, function(response) {
                        var state = response.getState();
                        if(state === "SUCCESS" && response.getReturnValue()) {
                            $('#successorErrorMessageLabel').css('color', 'green');
                            $('#successorErrorMessageLabel').html("Changes Saved!");
                            //get the selected PSet Id
                            //permissionSetNamesddl
                            var selectedPSetId = $('#permissionSetNamesddl').val();
                            this.getAllObjectPermissions(cmp, selectedPSetId);
                            this.opennCloseEdit(cmp);

                            //loading Individual Objects Field data
                            for(var objCountVal; objCountVal < objFieldData.length; objCountVal++) {
                                if(objFieldData[objCountVal].fieldDetails) {
                                    this.getFieldswithPermissions(cmp, objFieldData[objCountVal].key);
                                }
                            }

                        }
                        else if(!response.getReturnValue()) {
                            $('#successorErrorMessageLabel').css('color', 'red');
                            $('#successorErrorMessageLabel').html("There's an Error as the return value is false");
                        }
                        else if(state === "ERROR") {
                            $('#successorErrorMessageLabel').css('color', 'red');
                            $('#successorErrorMessageLabel').html("There's an Error");
                        }
                    });

                    $A.enqueueAction(action);
                }
            }
            else {
                var label = $('#creatingPSetName').val();
                var apiName = $('#creatingpSetAPIName').val();
                var selectedUserLicense = $('#creatingUserLicenseddl').val();
                var description = $('#creatingPSetDescription').val();
                if(selectedUserLicense == "NothingSelected") {
                    selectedUserLicense = "";
                }
                $('#successorErrorMessageLabel').html("");
                if(!(jQuery.isEmptyObject(label)) && !(jQuery.isEmptyObject(apiName))) {
                    $('#successorErrorMessageLabel').html("");
                    var action = cmp.get("c.createNewPermissionSetandSaveConcernedObjFieldPermissions");
                    var newlyCreatedPSet = this.createAPermissionSetDetailsClass(label, apiName, "", description, "", selectedUserLicense, "");
                    var changedRecordedObj =  cmp.get("{!v.changedRecordedObj}");
                    if(changedRecordedObj == undefined) {
                        changedRecordedObj = undefined;
                    }
                    var objFieldData = cmp.get("{!v.changedAllObjectDetails}");
                    if(objFieldData == undefined) {
                        objFieldData = undefined;
                    }

                    action.setParams({newlyCreatedpSetasString : JSON.stringify(newlyCreatedPSet), objectPermissionChangesasString : JSON.stringify(objFieldData), recordedChangesObjasString : JSON.stringify(changedRecordedObj)});
                    action.setCallback(this, function(response) {
                        var state = response.getState();
                        if(state === "SUCCESS" && response.getReturnValue()) {
                            $('#successorErrorMessageLabel').css('color', 'green');
                            $('#successorErrorMessageLabel').html("New Permission Set Created!");
                            this.contactServertoGetPermissionSet(cmp);
                            setTimeout(function() {
                                // hide things concerned to create new
                                // $('#mainDivForAllSubDivs').hide('slow');
                                // this.callBackForHidingClearingData

                                //enabling permissionSetNamesddl
                                // $('#permissionSetNamesddl').removeAttr('disabled');

                                //clear success message
                                // $('#successorErrorMessageLabel').html("");

                                location.reload();
                                // cmp.set("v.truthy","false")
                            }, 2000, cmp);

                            // $A.get('e.force:refreshView').fire();
                        }
                        else if(!response.getReturnValue()) {
                            $('#successorErrorMessageLabel').css('color', 'red');
                            $('#successorErrorMessageLabel').html("There's an Error while creating new permission Set as Response is false");
                        }
                        else if(state === "ERROR") {
                            $('#successorErrorMessageLabel').css('color', 'red');
                            $('#successorErrorMessageLabel').html("There's an Error while creating new permission Set");
                        }
                    });
                    $A.enqueueAction(action);
                }
                else {
                    $('#successorErrorMessageLabel').css('color', 'red');
                    $('#successorErrorMessageLabel').html("Enter Name");
                }
            }
        }
        catch(error) {
            console.log("error at pSetChangesSave: " + error);
        }
    },

    callBackForHidingClearingData : function(component, event) {
        this.clearAllAttributes(component);
        this.emptyExtraAttributes(component);
    },

    //NOTE: PermissionSet Details Elements on change helper Events

    pSetDescriptionChangeHelperCall : function(cmp, event) {
        try {
            //NOTE: PSet Description limit is 255 chars ONLY
            requiredChangedObject = cmp.get("{!v.text}")

            if(requiredChangedObject == null) {
                var actualPSetDetails = cmp.get("{!v.allPsDetails}");
                cmp.set("v.text", actualPSetDetails);
            }

            requiredChangedObject = cmp.get("{!v.text}");

            var pSetIdOfThisElement = $('#'+event.srcElement.id).attr('name');
            var descriptionChangedText = $('#'+event.srcElement.id).val();

            for(var pSetCount=0; pSetCount < requiredChangedObject.length; pSetCount++) {
                if(requiredChangedObject[pSetCount].id == pSetIdOfThisElement) {
                    requiredChangedObject[pSetCount].description = descriptionChangedText;
                    break;
                }
            }

            var changedRecordedObj = cmp.get("{!v.changedRecordedObj}");
            if(changedRecordedObj == null) {
                cmp.set("v.changedRecordedObj", this.updateWhatsChanged(pSetIdOfThisElement, true, null, null));
            }
            else {
                cmp.set("v.changedRecordedObj", this.updateWhatsChanged(pSetIdOfThisElement, true, changedRecordedObj.changesinObjPermissions, changedRecordedObj.changesinFieldPermissions));
            }
            cmp.set("v.text", requiredChangedObject);
        }
        catch(error) {
            console.log("errors in pSetDescriptionChangeHelperCall: " + error);
        }
    },

    pSetNameChangeHelperCall : function(cmp, event) {
        try {
            requiredChangedObject = cmp.get("{!v.text}");
            if(requiredChangedObject == null) {
                var actualPSetDetails = cmp.get("{!v.allPsDetails}");
                cmp.set("v.text", actualPSetDetails);
            }

            requiredChangedObject = cmp.get("{!v.text}");

            var pSetIdOfThisElement = $('#'+event.srcElement.id).attr('name');
            var apiNameChangedText = $('#'+event.srcElement.id).val();

            for(var pSetCount=0; pSetCount < requiredChangedObject.length; pSetCount++) {
                if(requiredChangedObject[pSetCount].id == pSetIdOfThisElement) {
                    requiredChangedObject[pSetCount].apiName = apiNameChangedText;
                    break;
                }
            }
            var changedRecordedObj = cmp.get("{!v.changedRecordedObj}");
            if(changedRecordedObj == null) {
                cmp.set("v.changedRecordedObj", this.updateWhatsChanged(pSetIdOfThisElement, true, null, null));
            }
            else {
                cmp.set("v.changedRecordedObj", this.updateWhatsChanged(pSetIdOfThisElement, true, changedRecordedObj.changesinObjPermissions, changedRecordedObj.changesinFieldPermissions));
            }
            cmp.set("v.text", requiredChangedObject);
        }
        catch(error) {
            console.log("errors in pSetNameChangeHelperCall: " + error);
        }
    },

    pSetLabelChangeHelperCall : function(cmp, event) {
        try {
            requiredChangedObject = cmp.get("{!v.text}");
            if(requiredChangedObject == null) {
                var actualPSetDetails = cmp.get("{!v.allPsDetails}");
                cmp.set("v.text", actualPSetDetails);
            }

            requiredChangedObject = cmp.get("{!v.text}");

            var pSetIdOfThisElement = $('#'+event.srcElement.id).attr('name');
            var nameChangedText = $('#'+event.srcElement.id).val();

            for(var pSetCount=0; pSetCount < requiredChangedObject.length; pSetCount++) {
                if(requiredChangedObject[pSetCount].id == pSetIdOfThisElement) {
                    requiredChangedObject[pSetCount].label = nameChangedText;
                    break;
                }
            }
            var changedRecordedObj = cmp.get("{!v.changedRecordedObj}");
            if(changedRecordedObj == null) {
                cmp.set("v.changedRecordedObj", this.updateWhatsChanged(pSetIdOfThisElement, true, null, null));
            }
            else {
                cmp.set("v.changedRecordedObj", this.updateWhatsChanged(pSetIdOfThisElement, true, changedRecordedObj.changesinObjPermissions, changedRecordedObj.changesinFieldPermissions));
            }
            cmp.set("v.text", requiredChangedObject);
        }
        catch(error) {
            console.log("errors in pSetLabelChangeHelperCall: " + error);
        }
    },

    // NOTE: This is for updating the Changes in Object Data

    updateWhatsChanged: function(pSetId, permissionSetDetailsTorF, objPermissions, fieldPermissions) {
        try {
            changesInData = {
                PermissionSetId : pSetId,
                changesinPermissionSetDetails : permissionSetDetailsTorF,
                changesinObjPermissions :objPermissions,
                changesinFieldPermissions : fieldPermissions
            }
            return changesInData;
        }
        catch(error) {
            console.log("errors in updateWhatsChanged: " + error);
        }
    },

    changesinObjPermsfxnCall : function(changedObjKey) {
        try {
            changedObjDetails = {
                Objkey : changedObjKey
            }
            return changedObjDetails;
        }
        catch(error) {
            console.log("errors in changesinObjPermsfxnCall: " + error);
        }
    },

    changesinFieldPermsfxnCall : function(changedFieldName, changedObjKey) {
        try {
            changedFieldDetails = {
                FieldName : changedFieldName,
                Objkey : changedObjKey
            }
            return changedFieldDetails;
        }
        catch(error) {
            console.log("errors in changesinFieldPermsfxnCall: " + error);
        }
    },

    updateChangesinObjorFieldPermissions : function(cmp, pSetid, objOrField, changedObjKey, changedfieldName) {
        try {
            var objPermCHangesList = [];
            var FieldPermCHangesList = [];
            var changes = cmp.get("{!v.changedRecordedObj}");

            if(changedObjKey != null && changedfieldName == null) {
                objPermCHangesList.push(this.changesinObjPermsfxnCall(changedObjKey));
            }
            if(changedObjKey != null && changedfieldName != null) {
                FieldPermCHangesList.push(this.changesinFieldPermsfxnCall(changedfieldName, changedObjKey));
            }

            if(changes == null) {
                changes = this.updateWhatsChanged(pSetid, false, objPermCHangesList, FieldPermCHangesList);
            }
            else {
                if(objOrField == "Object" && changes.changesinObjPermissions == null) {
                    changes.changesinObjPermissions = objPermCHangesList;
                }
                else if(objOrField == "Object" && changes.changesinObjPermissions != null) {

                    if(changedObjKey != "Allqwerty") {
                        var checkIfObjKeyAlreadyPresent = false;
                        for(var changedObjCount = 0; changedObjCount<changes.changesinObjPermissions.length; changedObjCount++) {
                            if(changes.changesinObjPermissions[changedObjCount].Objkey == changedObjKey || changes.changesinObjPermissions[changedObjCount].Objkey == 'Allqwerty') {
                                checkIfObjKeyAlreadyPresent = true;
                                break;
                            }
                        }
                        if(!checkIfObjKeyAlreadyPresent) {
                            changes.changesinObjPermissions.push(this.changesinObjPermsfxnCall(changedObjKey));
                        }
                    }
                    else {
                        //empty the list and add only 'Allqwerty' to the List
                        changes.changesinObjPermissions = objPermCHangesList;
                    }
                }
                else if(objOrField == "Field" && changes.changesinFieldPermissions == null) {
                    changes.changesinFieldPermissions = FieldPermCHangesList;
                }
                else if(objOrField == "Field" && changes.changesinFieldPermissions != null) {

                    if(changedfieldName != "Allqwerty") {
                        var checkIfObjKeynFieldAlreadyPresent = false;
                        for(var changedFieldCount = 0; changedFieldCount<changes.changesinFieldPermissions.length; changedFieldCount++) {
                            if(changes.changesinFieldPermissions[changedFieldCount].Objkey == changedObjKey && (changes.changesinFieldPermissions[changedFieldCount].FieldName == changedfieldName || changes.changesinFieldPermissions[changedFieldCount].FieldName == 'Allqwerty')){
                                checkIfObjKeynFieldAlreadyPresent = true;
                                break;
                            }
                        }
                        if(!checkIfObjKeynFieldAlreadyPresent){
                            changes.changesinFieldPermissions.push(this.changesinFieldPermsfxnCall(changedfieldName, changedObjKey));
                        }
                    }
                    else {
                        //empty the list and add only 'Allqwerty' to the List
                        changes.changesinFieldPermissions = FieldPermCHangesList;
                    }
                }
            }
            cmp.set("v.changedRecordedObj", changes);
        }
        catch(error) {
            console.log("errors in updateChangesinObjorFieldPermissions: " + error);
        }
    }
})



// Limitations:

//some of the field names of certain objects need at least read permission, thus, while testing pls consider this.
