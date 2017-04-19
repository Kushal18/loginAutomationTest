	"use strict";
	
	var webdriver = require('selenium-webdriver'),
	By = webdriver.By,
	until = webdriver.until;

	//enter username and password below
	var username = "";  
	var initialPlumaPassword = ""; //input the password from mail
	var userPassword = ""; //password from the user
	var lspRange1 = "";
	var lspRange2 = "";
	//enter username and password ends
	var coach =""; //make sure the coach is assigned to this client 
	var coachPassword="";
	

	var chai = require('chai');
	var expect = chai.expect;
	var chaiWebdriver = require('chai-webdriver');
	var assert = chai.assert;
	var clientfirstlogin = require('./tests/client/clientfirstlogin.js');
	var chatTest = require('./tests/chat/chat.js');
	var lsp = require('./tests/client/lsp.js');
	var updateClientInfo = require('./tests/client/clientInformation.js');
	var assesment = require('./tests/client/assesment360.js');
	var after360AndLsp = require('./tests/client/after360AndLsp.js');
	var plaResults = require('./tests/client/plaResultsCheck.js');
	var developmentPlan = require('./tests/client/developmentPlan.js');
	var syllabus = require('./tests/client/syllabus.js');
	// var logout = require('./tests/client/logout.js');

	//var testUpload = require('./tests/client/testUpload.js');
	var inCorrectPassword = "123"; 
	var randomPassword = "33535";   //any random password
	var noUpperCase = "kushal@1807";
	var noSpecialCharacter = "Kushal1807";
	var noNumber = "Kushal@#";
	var assesmentDone;

	//below variables used to invite
	var inviteEmailId = "plumatesting@gmail.com"; //don't include "+" sign in the invite email id
	var firstName = "test";
	var lastName = "test";
	//https://dev.pluma.co/assessment_instructions/246046de-087a-40bf-8
	//input assesment360Links and assesmentLspRange for assesment.
	var assesment360Links = [ 
								"",
								"",
								"",
								"",
								""
							];
							
	var assesmentLspRange1 = ["35","55","65","75","85"]; // recommend this average to be greater than lspRange1.
	var assesmentLspRange2 = ["20","25","35","45","55"];
	var assesmentLspRange3 = ["5","10","15","20","25"];  // recommend this average to be lesser than lspRange2.
	var assesmentLspAverage1 = 0;
	var assesmentLspAverage2 = 0;
	var assesmentLspAverage3 = 0;
	//assesment360Links and assesmentLspRange for assesment ends.

	
	var width = 1200; //for chrome width
	var height = 960; //for chrome heigth

	// first finishes the client onBoarding updates the client details and logsout and logsin to test chat and 
	// then tests lsp
	
	function testCases(driver) {
		if(assesmentDone == false) {
			clientfirstlogin.clientOnBoarding(driver,username,inCorrectPassword,initialPlumaPassword,randomPassword,userPassword,noUpperCase,noSpecialCharacter,noNumber);
			lsp.testLsp(driver,username,userPassword,lspRange1,lspRange2); 	
			updateClientInfo.clientDashBoard(driver,username,userPassword,inviteEmailId,firstName,lastName);
			//logout.logout(driver);
		}
	}
	function testChat(driver) {
		if(coach.length > 0) {
			chatTest.chat(driver,username,userPassword,coach,coachPassword);
		}
	}
	function checkPLA(driver) {
		for(var i = 0;i<assesmentLspRange1.length;i++) {
			assesmentLspAverage1 +=  Number(assesmentLspRange1[i]);
			assesmentLspAverage2 +=  Number(assesmentLspRange2[i]);
			assesmentLspAverage3 +=  Number(assesmentLspRange3[i]);
		}
		assesmentLspAverage1 = Number(assesmentLspAverage1)/5;
		assesmentLspAverage2 = Number(assesmentLspAverage2)/5;
		assesmentLspAverage3 = Number(assesmentLspAverage3)/5;
		//after360AndLsp.developmentPlan(driver,username,userPassword);
		plaResults.checkResults(driver,username,userPassword,lspRange1,lspRange2,assesmentLspAverage1,assesmentLspAverage2,assesmentLspAverage3);
	}
	
	var testAssesmentPlaAndChat = function(driver) {
		
		describe('',function(){
			assesment.assesment360(driver,username,userPassword,assesmentLspRange1,assesmentLspRange2,assesmentLspRange3,assesment360Links,lspRange1,lspRange2);
		});
		
		describe('',function(){
			checkPLA(driver);
		});
		
		describe('',function(){
			testChat(driver);
		});
		
	}
	var myArgs = process.argv.slice(2); //reads the argument from the command line for chrome or firefox
	
	switch(myArgs[1]) {
		case 'chrome' :
		var driver = new webdriver.Builder().forBrowser('chrome').build();
		driver.manage().window().setSize(width, height);
		assesmentDone = false;
		testCases(driver);
		break;

		case 'completeAssesment' :
		var driver = new webdriver.Builder().forBrowser('chrome').build();
		driver.manage().window().setSize(width, height);
		assesmentDone = true;
		testAssesmentPlaAndChat(driver);
		break;

		case 'checkPLA' :
		var driver = new webdriver.Builder().forBrowser('chrome').build();
		driver.manage().window().setSize(width, height);
		checkPLA(driver);
		break;

		case 'testChat' :
		var driver = new webdriver.Builder().forBrowser('chrome').build();
		driver.manage().window().setSize(width, height);
		testChat(driver);
		break;

		case 'firefox' :
		var driver = new webdriver.Builder().forBrowser('firefox').build();
		driver.manage.window.maximize(); //for firefox only
		testCases(driver);
		break;
		default :
		console.log("please input 'chrome' or 'firefox'");
	}
	
	
	
	

	
	


