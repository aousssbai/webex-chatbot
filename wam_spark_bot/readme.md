# Ping ID NLP Support Bot Starter Kit

This is a Webex Teams bot using the howdyai botkit framework, using nodejs. Additionally, this bot is also connected to Google's Natural Language API 'Dialogflow'. The goal of the bot aims to guide users to information regarding PingID (or Duo) that they may otherwise have trouble finding in the wiki pages or other sources. Hopefully in the future have it be a self service bot so one does not need to go into a console to manage their login devices.

## Getting Started

Create your Webex teams bot:

 - Go to https://www.developer.webex.com
 - Click on My Apps
 - Click the plus button and 'Create a Bot' Button
 - You will soon be led to a page to give your bot a name and an access token which you will place in your env file

Clone this repository:

`git clone repositorytostoreCode`

Install dependencies:

`cd botkit-starter-ciscospark
npm install`

Install botkit dialogflow middleware:

`npm install botkit-middleware-dialogflow`

Follow the steps in the dialogflow middleware [repository](https://github.com/jschnurr/botkit-middleware-dialogflow) to setup dialogflow and integrate the api with your specific bot.

## How the bot hears input

`controller.hears(['.*'], 'direct_message, direct_mention', dialogflowMiddleware.hears, function(
  bot,
  message
) {
  replyText = message.fulfillment.text;  // message object has new fields added by Dialogflow
  bot.reply(message, replyText);
});`

`['.*']` means that the bot will listen for every possible intent at a time

## How conversations work with the bot

Through dialogflow's NLP, a user will naturally try to get the information that he or she wants. Enter Dialogflow for more documentation on how Entities and Intents work and how to pass them all to the very end of a dialog so you can tell the bot what the user wants.

It is setup so that whenever you reach the end of a dialog in dialogflow, dialogflow will return a string that starts with 'end:'. The string that follows 'end:' is what information needs to be shown to the user. I have the following string to be a list of entities when paired together matches information that the wikipedia could show.

For example, a user may ask how to setup the yubikey and they've never used pingid before. The bot will record the entities (**See dialogflow's** [documentation](https://dialogflow.com/docs/intents) **for more help on how to achieve this**). In this case the entites are *yubikey*, *doesnothavedevice*, *register*. The resulting string to be passed is 'end:registeryubikeydoesnothavedevice', and the bot will look for this. 


## Enting a wizard

Once you reach the end of the dialog, the bot stops using dialogflow to take input and react to it and begins to use the wizard.

`bot.startConversation(message, function(err, convo) {
\	bot.reply(message, "some text");
\
	});
});`

There are some examples of some wizards within the bot. Similar to dialogflow, if you ever want to leave the wizard you have to say 'cancel' anywhere in your input. this will stop the conversation. 

`response.text.toLowerCase().includes('cancel')`

You can also make the wizard end through any other string of your choosing. I chose 'cancel' so that it is consistent with dialogflow.

For wizards with accompaning images for the steps, the next question would appear before the image aver popped up, so many times, I have it so the description of the image is the next step before you even take input. similar to the code below.

`convo.ask('1) Access an application protected by Digital Login, e.g. https://swipe.cisco.com/cec.\n\nnext step?', function(response, convo) {
    if (response.text.toLowerCase().includes('cancel')){
        bot.reply(message, "Okay leaving the wizard!");
        convo.stop();
    }
    else{
        bot.reply(message, {text: 'next step?', files:[fs.createReadStream('./images/Yubikey_4.png')]});
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
});`

The first image being posted for the second step, './images/Yubikey_4.png' has its respective description as the next 'convo.ask('2) etc..')'.

## More Sources

[Here](https://botkit.ai/docs/readme-ciscospark.html) is more botkit Documentation for Webex Teams

[Here](https://dialogflow.com/docs/getting-started) is for more documentation on how to work with NLP


















