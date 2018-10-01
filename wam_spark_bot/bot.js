
var env = require('node-env-file');
env(__dirname + '/.env');
var fs = require('fs');
var stop = ['stop', 'cancel', 'interrupt', 'abort', 'withdraw'];
var approval = ['yes', 'yeah', 'ok', 'sure', 'yep', 'yup', 'y'];
var refusal = ['no', 'stop', 'repeat', 'n', 'cancel', 'abort'];




var sortAlphabets = function(text) {
    return text.split('').join('');
};

if (!process.env.access_token) {
    console.log('Error: Specify a Cisco Spark access_token in environment.');
    usage_tip();
    process.exit(1);
}

if (!process.env.public_address) {
    console.log('Error: Specify an SSL-enabled URL as this bot\'s public_address in environment.');
    usage_tip();
    process.exit(1);
}

var Botkit = require('botkit');
var debug = require('debug')('botkit:main');
// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.sparkbot({
    // debug: true,
    // limit_to_domain: ['mycompany.com'],
    // limit_to_org: 'my_cisco_org_id',
    public_address: process.env.public_address,
    ciscospark_access_token: process.env.access_token,
    studio_token: process.env.studio_token, // get one from studio.botkit.ai to enable content management, stats, message console and more
    secret: process.env.secret, // this is an RECOMMENDED but optional setting that enables validation of incoming webhooks
    webhook_name: 'Cisco Spark bot created with Botkit, override me before going to production',
    studio_command_uri: process.env.studio_command_uri,
});

var options = {
    keyFilename: process.env.dialogflow,
}

var dialogflowMiddleware = require('botkit-middleware-dialogflow')(options);

controller.middleware.receive.use(dialogflowMiddleware.receive);

controller.on('bot_space_join', function(bot, message) {
  bot.startConversation(message, function(err, convo) {
    convo.say('I can help you through these things about PingID!  \n  \n' +
             ' - First time registration pingID  \n' +
             ' - Add a new login device  \n' +
             ' - Change to a different login device  \n' +
             ' - Delete an authentication device  \n' +
             ' - How to use a device  \n  \n' +
             'Here are some problems that users often face that I have some knowledge of:  \n  \n' +
             ' - Changing primary devices when you don\'t have your old one  \n' +
             ' - Forgetting the PIN to your desktop application  \n' +
             ' - Adding a new device  \n' +
             ' - First time setup  \n  \n' +
             'Additionally, you can ask me anytime what devices PingID supports!'
        );
  });
});


controller.hears(['.*'], 'direct_message, direct_mention', dialogflowMiddleware.hears, function(bot, message) {
    if (message.intent == "bot.help" || message.intent == 'bot.showDevices'){
        replyText = message.fulfillment.messages[0].text.text[0];
        console.log(message.fulfillment.messages[0].text.text[0])
        bot.reply(message, replyText);
    }
    else{
        //do everything in here
        replyText = message.fulfillment.text;

        console.log(message.entities);
        console.log("|||||||||||");

        if (replyText.includes('end:')){
            var solution = replyText.replace('end:','');

            if (solution === 'setupyubikey'){
                bot.startConversation(message, function(err, convo) {
                    var end = false;
                    bot.reply(message, 'I think I have the information for your request (hopefully)!  \nAdditionally, you can find this \
                        information here: https://wiki.cisco.com/display/GISIAM/How+to+register+Yubikey+as+a+PingID+Authentication+Device');
                    convo.ask('Say anything to start the wizard! Once you start using the wizard, say "cancel" to leave', function(response, convo) {
                        if (response.text.toLowerCase().includes('cancel')){
                            bot.reply(message, "Okay leaving the wizard!");
                            convo.stop();
                        }
                        else{
                            convo.next();
                        }
                    });
                    convo.ask('1) On your desktop computer, access https://swipe.cisco.com/\n\nnext step?', function(response, convo) {
                        if (response.text.toLowerCase().includes('cancel')){
                            bot.reply(message, "Okay leaving the wizard!");
                            convo.stop();
                        }
                        else{
                            bot.reply(message, {text: 'next step?', files:[fs.createReadStream('./images/swipe.cisco.com.png')]});
                            convo.next();
                        }
                    });
                    convo.ask('2) Click on "Click here to view/modify your profile"', function(response, convo) {
                        if (response.text.toLowerCase().includes('cancel')){
                            bot.reply(message, "Okay leaving the wizard!");
                            convo.stop();
                        }
                        else{
                            bot.reply(message, {text: 'next step?', files:[fs.createReadStream('./images/LoginForm.png')]});
                            convo.next();
                        }
                    });
                    convo.ask('3) If asked, enter Username and Password. If not, skip this step.', function(response, convo) {
                        if (response.text.toLowerCase().includes('cancel')){
                            bot.reply(message, "Okay leaving the wizard!");
                            convo.stop();
                        }
                        else{
                            bot.reply(message, {text: 'next step?', files:[fs.createReadStream('./images/MFA_Swipe.png')]});
                            convo.next();
                        }
                    });
                    convo.ask('4) You will be asked to complete MFA with already registered device.', function(response, convo) {
                        if (response.text.toLowerCase().includes('cancel')){
                            bot.reply(message, "Okay leaving the wizard!");
                            convo.stop();
                        }
                        else{
                            bot.reply(message, {text: 'next step?', files:[fs.createReadStream('./images/Yubikey_1.png')]});
                            convo.next();
                        }
                    });
                    convo.ask('5) You will land on PingID My Devices page where you can Add, Delete Authentication devices. Click on "Add" button to add new device."', function(response, convo) {
                       if (response.text.toLowerCase().includes('cancel')){
                            bot.reply(message, "Okay leaving the wizard!");
                            convo.stop();
                        }
                        else{
                            bot.reply(message, {text: 'next step?', files:[fs.createReadStream('./images/Yubikey_2.png')]});
                            convo.next();
                        }
                    });
                    convo.ask('6) You will see "Add a New Device" page. Click on the "Yubikey" option.', function(response, convo) {
                        if (response.text.toLowerCase().includes('cancel')){
                            bot.reply(message, "Okay leaving the wizard!");
                            convo.stop();
                        }
                        else{
                            bot.reply(message, {text: 'next step?', files:[fs.createReadStream('./images/Yubikey_3.png')]});
                            convo.next();
                        }
                    });
                    convo.ask('7) You will see the below screen. Insert your Yubikey and press the button, or tap it, to begin pairing.', function(response, convo) {
                        if (response.text.toLowerCase().includes('cancel')){
                            bot.reply(message, "Okay leaving the wizard!");
                            convo.stop();
                        }
                        else{
                            bot.reply(message, {text: 'next step?', files:[fs.createReadStream('./images/YubiKey_6.png')]});
                            convo.next();
                        }
                    });
                    convo.ask('8) Yubikey will get paired successfully and In PingID profile page, the "Yubikey" will get listed in the device list', function(response, convo) {
                        if (response.text.toLowerCase().includes('cancel')){
                            bot.reply(message, "Okay leaving the wizard!");
                            convo.stop();
                        }
                        else{
                            bot.reply(message, {text: 'this was the last step, leaving the wizard', files:[fs.createReadStream('./images/YubiKey_Primary.png')]});
                            end = true;
                            convo.next();
                        }
                    });
                    convo.say('9) Use the "PRIMARY" column toggle to set the "Yubikey" as the primary method/device by moving the toggle to the right (green).If you prefer to keep it as a secondary device, use the "PRIMARY" column toggle and keep the toggle to the left(grey).');
                    if (end === true) {
                        convo.stop()
                    }
                });
            }
            else if (solution==='useyubikeyhasdevice' || solution==='useyubikeydoesnothavedevice'){
                bot.startConversation(message, function(err, convo) {
                    var end = false;
                    bot.reply(message, 'I think I have the information for your request (hopefully)!');
                    convo.ask("you would like to use your yubikey as a primary authentication device right ?", function(response, convo) {
                        if (refusal.includes(response.text.toLowerCase())){
                            bot.reply(message, "ok leaving the wizard !");
                            convo.stop();
                        }
                        else{
                            convo.next();
                        }
                    });
                    convo.ask("let's get started ! \n\n1) Access an application protected by Digital Login, e.g. https://swipe.cisco.com/cec.\n\n ", function(response, convo) {
                      sleep(2000);

                      bot.reply(message, {files:[fs.createReadStream('./images/Yubikey_4.png')]});
                      convo.next()});

                    convo.ask("ready for next step ?", function(response, convo){
                      if (refusal.includes(response.text.toLowerCase())){
                          bot.reply(message, "if you experience any trouble, you can find the full guide here: https://wiki.cisco.com/display/GISIAM/How+to+use+Yubikey+as+Primary+Authentication+device");
                              convo.repeat
                              convo.next();
                      }
                      else{

                          convo.next();
                      }

                    });


                    convo.ask('2) When you are challenged for Yubikey authentication, below screen will be shown', function(response, convo) {
                        if (response.text.toLowerCase().includes('cancel')){
                            bot.reply(message, "Okay leaving the wizard!");
                            convo.stop();
                        }
                        else{
                            bot.reply(message, {text: 'next step?', files:[fs.createReadStream('./images/Yubikey_5.png')]});
                            convo.next();
                        }
                    });
                    convo.ask('3) Insert your Yubikey, if not already inserted and then press the button, or tap it. Authentication code will get copied as shown below. Press on "Sign On" button. If you press Yubikey button longer, you even don\'t need to press "Sign On" button.', function(response, convo) {
                        if (response.text.toLowerCase().includes('cancel')){
                            bot.reply(message, "Okay leaving the wizard!");
                            convo.stop();
                        }
                        else{
                            bot.reply(message, {text: 'this was the last step, leaving the wizard', files:[fs.createReadStream('./images/authenticated.png')]});
                            convo.next();
                        }
                    });
                    convo.say('You will get successfully authenticated.');
                    if (end === true) {
                        convo.stop()
                    }
                });
            }
            else if (solution === 'changemobileappdoesnothavedevice'){
                bot.startConversation(message, function(err, convo) {
                    var end = false;
                    bot.reply(message, 'I think I have the information for your request (hopefully)!  \nAdditionally, you can find this \
                        information here: https://wiki.cisco.com/display/GISIAM/How+to+pair+a+new+phone+when+old+phone+is+no+longer+available');
                    convo.ask('Say anything to start the wizard! Once you start using the wizard, say "cancel" to leave', function(response, convo) {
                        if (response.text.toLowerCase().includes('cancel')){
                            bot.reply(message, "Okay leaving the wizard!");
                            convo.stop();
                        }
                        else{
                            bot.reply(message, {text: 'next step?', files:[fs.createReadStream('./images/self_service_1.png')]});
                            convo.next();
                        }
                    });
                    convo.ask('1) Make sure you have e-mail or some other accessible alternate method available for authenticating with PingID  \n' +
                        ' - On your laptop computer, visit https://swipe.cisco.com/selfservice (This site can be accessed using traditional login - just username and password.)  \n' +
                        ' - Select \'Production\'  \n' +
                        ' - Validate \'Email\' is listed as one of hte registered Device Types  \n' +
                        ' - If not, click the button \'Register\' Cisco Email as Authenticator', function(response, convo) {
                        if (response.text.toLowerCase().includes('cancel')){
                            bot.reply(message, "Okay leaving the wizard!");
                            convo.stop();
                        }
                        else{
                            bot.reply(message, {text: ' - This will bring you to your Device List  \n', files:[fs.createReadStream('./images/self_service_2.png')]});
                            bot.reply(message, {text: ' - If you get a session not found error, then access this url directly https://desktop.pingone.com/cisco-prod/Selection?cmd=devices and continue to the next step  \n', files:[fs.createReadStream('./images/self_service_3.png')]});
                            convo.next();
                        }
                    });
                    convo.ask('2) Access your PingID Profile Device List  \n' +
                        ' - On your laptop computer, visit https://swipe.cisco.com/cec  \n' +
                        ' - During the authentication screen, click the \'Settings\' button', function(response, convo) {
                        if (response.text.toLowerCase().includes('cancel')){
                            bot.reply(message, "Okay leaving the wizard!");
                            convo.stop();
                        }
                        else{
                            bot.reply(message, {text: 'next step?', files:[fs.createReadStream('./images/Yubikey_5.png')]});
                            convo.next();
                        }
                    });
                    convo.ask('3) ', function(response, convo) {
                        if (response.text.toLowerCase().includes('cancel')){
                            bot.reply(message, "Okay leaving the wizard!");
                            convo.stop();
                        }
                        else{
                            bot.reply(message, {text: 'this was the last step, leaving the wizard', files:[fs.createReadStream('./images/authenticated.png')]});
                            convo.next();
                        }
                    });
                    convo.say('You will get successfully authenticated.');
                    if (end === true) {
                        convo.stop()
                    }
                });
            }
            else if (solution==='makeCase'){
                bot.startConversation(message, function(err, convo) {
                    convo.ask('Okay, what are you having problems with? Say "cancel" anywhere to not make the case', function(response, convo) {
                        if (response.text.toLowerCase().includes('cancel')){
                            console.log("Okay I won't make the case")
                            bot.reply(message, "Okay I won't make the case then.");
                            convo.stop();
                        }
                        else{
                            /////////////////////////////////
                            // Log response.text as a case //
                            /////////////////////////////////
                            console.log("Okay your issue has been received we'll let you know when we find an answer to your question")
                            bot.reply(message, "Okay your issue has been received. We'll let you know when we find an answer to your question!");
                            convo.stop();
                        }
                    });
                });
            }

            else if(solution==='ScaleUp'){

                //i have to scale the vm up
                bot.reply(message, "alright, let me scale the Azure VM up")
                var request = require('request');
                var options = {
                    url: 'https://s15events.azure-automation.net/webhooks?token=ax%2f9nfGBQ9ydABSNAGlad2hLaSkny2YkdC5lOGC1XbM%3d',
                    method: 'POST',
                    form: {'text':'hey' }
                }

                request(options, function (error, response, body){})
            }



        }
        else{
            bot.reply(message, replyText);
        }

    }
    console.log("|||||||||||||||||||||||||||||||||||||||||||||||")
});



/////////////////////////// This is all of the extra stuff /////////////////////////////////
// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Tell Cisco Spark to start sending events to this application
require(__dirname + '/components/subscribe_events.js')(controller);

// Load in some helpers that make running Botkit on Glitch.com better
require(__dirname + '/components/plugin_glitch.js')(controller);

// enable advanced botkit studio metrics
require('botkit-studio-metrics')(controller);

var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});


// This captures and evaluates any message sent to the bot as a DM
// or sent to the bot in the form "@bot message" and passes it to
// Botkit Studio to evaluate for trigger words and patterns.
// If a trigger is matched, the conversation will automatically fire!
// You can tie into the execution of the script using the functions
// controller.studio.before, controller.studio.after and controller.studio.validate
if (process.env.studio_token) {
    controller.on('direct_message,direct_mention', function(bot, message) {
        if (message.text) {
            controller.studio.runTrigger(bot, message.text, message.user, message.channel, message).then(function(convo) {
                if (!convo) {
                    // no trigger was matched
                    // If you want your bot to respond to every message,
                    // define a 'fallback' script in Botkit Studio
                    // and uncomment the line below.
                    controller.studio.run(bot, 'fallback', message.user, message.channel, message);
                } else {
                    // set variables here that are needed for EVERY script
                    // use controller.studio.before('script') to set variables specific to a script
                    convo.setVar('current_time', new Date());
                }
            }).catch(function(err) {
                if (err) {
                    bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err);
                    debug('Botkit Studio: ', err);
                }
            });
        }
    });
} else {
    // console.log('~~~~~~~~~~');
    // console.log('NOTE: Botkit Studio functionality has not been enabled');
    // console.log('To enable, pass in a studio_token parameter with a token from https://studio.botkit.ai/');
}

function usage_tip() {
    // console.log('~~~~~~~~~~');
    // console.log('Botkit Studio Starter Kit');
    // console.log('Execute your bot application like this:');
    // console.log('access_token=<MY ACCESS TOKEN> public_address=<https://mybotapp/> node bot.js');
    // console.log('Get Cisco Spark token here: https://developer.ciscospark.com/apps.html')
    // console.log('Get a Botkit Studio token here: https://studio.botkit.ai/')
    // console.log('~~~~~~~~~~');
}
