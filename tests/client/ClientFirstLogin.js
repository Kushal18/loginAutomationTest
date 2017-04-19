/*
	Input the following 
	1.) enter username in the username variable
	2.) password in the correctPassword variable
	3.) and a New Password in the newPassword Variable (dont use the password in the correct password field)
	*/
	
	var webdriver = require('selenium-webdriver'), 
	By = webdriver.By,
	until = webdriver.until;

	var chai = require('chai');
	var expect = chai.expect;
	var chaiWebdriver = require('chai-webdriver');
	var assert = chai.assert;
	
	chai.should();
	//chai.use(chaiWebdriver(driver));
	var login = require("./login.js");
	var passwordCheck = require("./passwordCheck.js");
	var screenshots = require("../screenshots/screenshot.js");
	var timezone;

	//the below code checks for the incorect credentials and expects the system to throw "Incorrect email or password"
	//if failed throws an assertion error and then tries to login with correct credentials.

	var clientOnBoarding = function(driver,username,inCorrectPassword,initialPlumaPassword,randomPassword,userPassword,noUpperCase,noSpecialCharacter,noNumber){
		
		describe('Start onBoarding', function() {
			before(function(done) {
				driver.get('https://dev.pluma.co/client-sign-in').then(done);
			});
			it('Login with Incorrect credentials', function(done) {
				login.username(username,driver);
				login.password(inCorrectPassword,driver);
				driver.findElement(webdriver.By.className("client-onboarding-signin-btn")).click();
				driver.findElement(By.css(".has-error")).getText().then(function(text) {
					try {
						expect(text).to.equal("Invalid email or password");
						done();
					} catch (e) {
						done(e);
					}
				});
			});
			it('Login with correct credentials', function(done) {
				login.username(username,driver);
				login.password(initialPlumaPassword,driver);
				driver.findElement(webdriver.By.className("client-onboarding-signin-btn")).click().then(function() {
					done();
				});
			});

		});


		describe('Test Cases for Old and New Password', function() {
			it('check for old and new password with the same values', function(done) {
				passwordCheck.oldPassword(initialPlumaPassword,driver);
				passwordCheck.confirmNewPassword(initialPlumaPassword,driver);
				passwordCheck.newPassword(initialPlumaPassword,driver);
				passwordCheck.signInClick(driver);
				driver.findElement(By.css(".form-signin>p")).getText().then(function(text) {
					try {
						expect(text).to.equal("New password cannot be the same as old one.");
						done();
					} catch (e) {
						done(e);
					}
				});
			});	

			it('check for wrong old value', function(done) {
				passwordCheck.oldPassword(inCorrectPassword,driver);
				passwordCheck.confirmNewPassword(userPassword,driver);
				passwordCheck.newPassword(userPassword,driver);
				passwordCheck.signInClick(driver);
				driver.findElement(By.css(".form-signin>p")).getText().then(function(text) {
					try {
						expect(text).to.equal("Old password is incorrect");
						done();
					} catch (e) {
						done(e);
					}
				});
			});


			it('check for wrong passwords in confirm and new password', function(done) {
				passwordCheck.oldPassword(initialPlumaPassword,driver);
				passwordCheck.confirmNewPassword(userPassword,driver);
				passwordCheck.newPassword(randomPassword,driver);
				passwordCheck.signInClick(driver);
				driver.findElement(By.css(".form-signin>p")).getText().then(function(text) {
					try {
						expect(text).to.equal("Passwords do not match");
						done();
					} catch (e) {
						done(e);
						driver.quit();
					}
				});
			});
			it('check less than 8 characters', function(done) {
				passwordCheck.oldPassword(initialPlumaPassword,driver);
				passwordCheck.confirmNewPassword(inCorrectPassword,driver);
				passwordCheck.newPassword(inCorrectPassword,driver);
				passwordCheck.signInClick(driver);
				driver.findElement(By.css(".form-signin>p")).getText().then(function(text) {
					try {
						expect(text).to.equal("Password must be at least 8 characters long.");
						done();
					} catch (e) {
						done(e);
						driver.quit();
					}
				});
			});
			it('check no upperCase letters', function(done) {
				passwordCheck.oldPassword(initialPlumaPassword,driver);
				passwordCheck.confirmNewPassword(noUpperCase,driver);
				passwordCheck.newPassword(noUpperCase,driver);
				passwordCheck.signInClick(driver);
				driver.findElement(By.css(".form-signin>p")).getText().then(function(text) {
					try {
						expect(text).to.equal("Password must contain at least one upper case letter.");
						done();
					} catch (e) {
						done(e);
						driver.quit();
					}
				});
			});
			it('check no special characters', function(done) {
				passwordCheck.oldPassword(initialPlumaPassword,driver);
				passwordCheck.confirmNewPassword(noSpecialCharacter,driver);
				passwordCheck.newPassword(noSpecialCharacter,driver);
				passwordCheck.signInClick(driver);
				driver.findElement(By.css(".form-signin>p")).getText().then(function(text) {
					try {
						expect(text).to.equal("Password must contain at least one special character.");
						done();
					} catch (e) {
						done(e);
						driver.quit();
					}
				});
			});
			it('check no number', function(done) {
				passwordCheck.oldPassword(initialPlumaPassword,driver);
				passwordCheck.confirmNewPassword(noNumber,driver);
				passwordCheck.newPassword(noNumber,driver);
				passwordCheck.signInClick(driver);
				driver.findElement(By.css(".form-signin>p")).getText().then(function(text) {
					try {
						expect(text).to.equal("Password must contain at least one number.");
						done();
					} catch (e) {
						done(e);
						driver.quit();
					}
				});
			});

			it('Input correct password in confirm and newpassword', function(done) {
				passwordCheck.oldPassword(initialPlumaPassword,driver);
				passwordCheck.confirmNewPassword(userPassword,driver);
				passwordCheck.newPassword(userPassword,driver);
				driver.findElement(webdriver.By.className("client-onboarding-signin-btn")).click().then(function(){
					done();
				});
			});

		});
		
		//password change but dont complete the onboarding changes starts.
		describe('Login Test Case', function() {
			before(function(done) {
				driver.get('https://dev.pluma.co/client-sign-in').then(done);
			});
			it('Login with correct credentials', function(done) {
				login.username(username,driver);
				login.password(userPassword,driver);
				driver.findElement(webdriver.By.className("client-onboarding-signin-btn")).click().then(function() {
					done();
				});
			});
		});
		//password change but dont complete the onboarding changes ends.

		describe('Complete Client Onboarding',function(){
			it('select the gender',function(done){
				driver.findElement(webdriver.By.css('.button.client-onboarding-next-btn.full-width')).click("Male").then(function(){
					done();	
				});
			});
			it('select the Date of birth',function(done){
				driver.sleep(500);
				driver.findElement(webdriver.By.className("glyphicon-calendar")).click();
				driver.sleep(500);
				driver.findElement(webdriver.By.className("year active")).click();
				driver.sleep(500);
				driver.findElement(webdriver.By.className("month active")).click();
				driver.sleep(500);
				driver.findElement(webdriver.By.className("day active")).click();
				driver.sleep(500);
				driver.findElement(webdriver.By.className("client-onboarding-next-btn")).click().then(function(){
					done();	
				}); 

			});
			it('Enter address',function(done){
				driver.findElement(webdriver.By.name("city")).clear();
				driver.findElement(webdriver.By.name("city")).sendKeys("San Jose").then(function(){
					driver.sleep(500);
					driver.findElement(webdriver.By.name("state")).clear();
					driver.findElement(webdriver.By.name("state")).sendKeys("California");
					driver.sleep(500);
					driver.findElement(webdriver.By.name("country")).clear();
					driver.findElement(webdriver.By.name("country")).sendKeys("United States");
					driver.sleep(500);
					driver.findElement(webdriver.By.name("zipcode")).clear();
					driver.findElement(webdriver.By.name("zipcode")).sendKeys("95110");
					driver.sleep(500);
					timezone = driver.findElement(webdriver.By.name("timezone"));
					driver.sleep(500);
					timezone.click();
					driver.sleep(500);
					timezone.findElement(webdriver.By.css("option[value='America/Los_Angeles']")).click();
					driver.sleep(500);
				});
				driver.findElement(webdriver.By.className("client-onboarding-next-btn")).click().then(function(){
					done();	
				}); 	
			});
			it('Enter Education',function(done){
				driver.findElement(webdriver.By.css('.button.client-onboarding-next-btn.full-width')).click("Graduate or professional").then(function(){
					done();

					driver.sleep(2000);
				});
			});
			it('Enter Direct Reports',function(done){
				driver.findElement(webdriver.By.css('.button.client-onboarding-next-btn.full-width')).click("1-5").then(function(){
					done();
				});
			});
			it('should logout',function(done){
		driver.findElement(webdriver.By.css('#menu')).click();			//clicks on the menu
		driver.sleep(1000);
	    driver.findElement(webdriver.By.id("logout")).click().then(function(){ //clicks on the log out
		   done();
		});
	});
		});

	};

	module.exports.clientOnBoarding = clientOnBoarding;



