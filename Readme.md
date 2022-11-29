# Onyx Core
The Onyx Personal Assistant program is a series of functionalities which, when combined, act as a digital personal assistant.
This project aims to be a framework by which other interested parties can make their lives significantly easier, by adding tasks
and other actions for it to perform. It was built with an emphasis on security and privacy, and the intent that it would be
entirely self-hostable. If I'm going to have a truly comprehensive personal assistant, I want it to know a lot about me, without
storing that data on some big tech server. Therefore, everything in Onyx is entirely self-hostable, and as private as you make it.

## Modules
Onyx Core consists of the main modules that a functional digital assistant might require.

#### Interpretation
Using NLU (mainly [nlp.js](https://github.com/axa-group/nlp.js)), you can easily classify intents of certain language, and map
them to either responses, or actions, which will return responses.

#### Actions
This is the truly unlimited aspect of Onyx, as any action can be performed through this module. This is where you will define actions
to be taken, or, if you have a custom action server, you will interface with that. It's completely customizable, but all of the
complexities of mapping plain text to actions has been taken care of.

#### People
This is where the boring tasks like Auth and other user management takes place. Although it is also intended as a hub for generating
context on specific users. Such as interests and other analytics that could be important for interpretation and action performance.
Of course, all of this data is entirely self-hosted by the user, and is as private as your database.

#### Third Parties
As I said, this is entirely self-hosted. However, there will be times in which you want to utilize external services, such as 
Open Weather or Google Maps. It's not practical to host them yourself, and therefore a proxy service is created, which will act
as the interface to all third party needs.


## Contribution and Using the Tech
Right now I don't have a license, nor do I think the project is complete enough to worry about them. Therefore, fork or clone
to your hearts intent. If anyone wants to help or just talk about the project, contact me through my [website](https://aidantilgner.dev).