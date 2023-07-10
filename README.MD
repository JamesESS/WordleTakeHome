# Take home task wordle clone
Take-home challenge for Limio
For this take-home challenge I need to split wordle up in to user stories and choose one of those stories to develop.
I've decided to deal with ever player receiving the same word and getting a new word each day.
You can see my site [here](https://jamesess.github.io/wordleTakeHome/)


## User Stories

- as a player I want to 
    - be able to use my actual keboard or an onscreen keyboard
    - have clear feedback about which letters in my guess are incorrect so I can adjust my future guesses
    - have clear feedback showing if a letter in my guess is correctly positioned or is in the word but not at that position
    - have a record of which letters I've guessed and if the were correct or not so I don't mistakenly use letters I know are incorrect
    - get a new word each time I play to keep the game interesting
    - only accept valid words as guesses to keep the game challenging
    - be notified when I've failed to guess the word
    - be notified when I've successfully guessed the word
    - see the correct word if I fail
    - recieve a new word each time I play so I don't get bored
    - have limitations on how often I can play to help keep the game fresh
- as a competitive player I want 
    - everyone to get the same word so I can easily compare my results with others
    - information on my performance in previous rounds so I can see my progress
- as a modern user I want
    - to be able to play the game on any of my devices

## My Choice
As this is for a devops role I thought it would be fun to try and tackle

- as a competitive player I want everyone to get the same word so I can easily compare my results with others

This will give me an opportunity to play around with some of the services AWS offers.
Ideally I'll make use of Terraform to build my infrastructure

## Planning
I knew I'd be using AWS services for this. It was between an s3 bucket or DynamoDB to store the word. I decided to use DynamoDB because I figured it might help with future user story of getting a new word each time if when a word is replaced it get's shifted to another table which stores the last x words used.

I also knew I'd be using the API gateway to actually retrieve the word for my frontend site.
I found a [free API](https://random-word-api.vercel.app/) that lets you get a random word with the number of letters you choose.

## Building
I started by playing around with the word API to make sure it actually did what I expected. Then through numerous conversations with chatGPT and youtube videos I started writing lambda functions to interact with this API and update a table with the result.

I also wrote a lambda function to get the word from my table and serve it a response when a GET request was made to my API
Using chatGPT I described my infrastructure in Terraform and ran it.

I needed a trigger for my update word function after a bit of reading I discovered you can make time based events in CloudWatch so I set that up linked it to my updateWord function and tested to ensure it worked as expected.

Once that was all up and running I moved over to getting my API and the serveWord lambda function. In the end I couldn't get the lambda function working correctly. So following [this tutorial](https://github.com/mwittenbols/How-to-integrate-your-static-website-with-DynamoDB-without-using-Lambda) I set up a new API and set up the GET method return a scan of my table. It would probably be better to use GetItem here but as my table only has (and should only ever have) one entry I wasn't too concerned about Scan being inefficient.

Once all of this was set up I was able to test my API through AWS and see that I get back the word currently stored in my table. After enabling CORS I was able to get the word from a static test site I made.

Then I needed to make my front end site. As I'm only tackling issues [#11(word refresh limit)](https://github.com/JamesESS/wordleTakeHome/issues/11) & [#12(all users get same word)](https://github.com/JamesESS/wordleTakeHome/issues/12) there wasn't too much work I could do on the fron end.
I set up a grid to mimic wordle and at the bottom put an extra row with todays word. I've also added a button to update the word for testing purposes. The word refresh rate is currently 24 hours so I wanted an easy way to get new words and ensure everything was still working as expected.

The testing button meant adding another method to my API I set it up so the POST method would trigger my lambda function.
## Debugging
I enabled CloudWatch logs for my Lambda functions and my API. There was a lot of sifting through logs

Originally I was using fetch to query the word API but looking through logs for my lambda function I realised this was causing issues. Fetch is a browser API so I needed to change this to use the HTTP method.

I still haven't gotten to the bottom of why my serveWord lambda function isn't working correctly for the time being I've removed the lambda function and api from my codebase. 


## Future Improvements
In the end I've used the AWS site to set up my API Gateway and CloudWatch event trigger. I'd like to try and declare these with terraform so I can build and destroy the entire infrastructure easily.

I'd like to set up a second dynamoDB table to push words to when they get replaced so that I have a reference of what words have already been done in the last x days/months. At that point it might make more sense to change over to Amazon RDS and have a third table with a dictionary to get words from instead of using an external API.

It would be cool to deploy the frontend site using AWS as well instead of github pages
