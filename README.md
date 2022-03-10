# Logtree

This is logtree, a platform compile a lot of useful productivity applications together in one bundle and learn users use it easely.

## Feature

### Summary

- Topic: let you link and connect to other modules
- Tracker: allow you to track time without worrying of accidentally close the tab.
- Links: save any links according to the topic.
- Notes: store and edit any note associate to topic

### Topic

One of the core model within Logtree is the topic, in the backend db known as category, which is the association between user and other module like Tracker, Links, Notes, etc...

### Tracker

This module allow you to track the time you spent on each certain topic, you can stop / stop / resume the tracking. This is server-side based tracker, which mean you don t have to worry if you accidentally close the tab as long as you have access to the internet and browser, you can open it to continue.

### Links

You can store links according to topic or category.

### Notes:

Like Links, but instead, you can use markdown syntax here, this is instead for storing notes.

## Inspiration

About a year ago or longer, I was fairly new to programming. I was delight when one of my inspiration (Avanier) showed me of what he had made. Many of his applications and program were for improving his own productivity. From then on, I determined that I would try my best to make one to improve myself as well. A lot of things happen later on that I got delay until now.

That s it.

## The Idea

There are many things that constantly bugging me. One of them is about time management, many times that I wonder how much time I have work on this specific project?

Two, I want to make a short note using other computers or just simply for copy paste and store it properly.

There were variety of useful resources that I really like to explore and I did, I didn t pay much attention for a while, and now my bookmark is super clutter right now. There are many useless stuff that I store and now it also had buried those I have considered imporant.

Now this era where I have to worry on security, I also not comfortable constantly login and using two authentication for so many times on different devices. So I just wished that I am able to just login once and yeah the other app follow the same way.

Last of all, I also wish that I can keep improving this project and adding more stuff as well whether for fun or learning

## The Goal

Upon brainstorming upon this idea, I decide to start working on a tracker first in which I can track my time and category I spent, then make a link storage in which to save and category the links that I saved; and lastly is a short term note.

## The Timeframe

I didn t really set any timeframe for this project, but I wanted to add the functionality that I need at least by the end of March 2022.


## Framework

This project is made with:
- Hosting: Github + Vercel
- Database: PlanetScale
- ORM: Prisma
- Backend: Nextjs, NextAuth, SWR
- Frontend: TailwindCSS

## Learn

- SWR is faster than ServerSideRendering
- Form -onSubmit works on firefox, but it might not work on Chrome [Might be because of beta version]
- Run query in one go, not many queries for ORM, else it'll be slow as snail.
- Dont use single quote on nextjs jsx, else ure doom.
-


## Log

- 02-03-2022: update the dashboard
- 03-03-2022: rename timer to tracker
- 04-03-2022: update quotes fetching, storing it at local storage
- 05-03-2022: adding ui and functionality / usign serverside component
- 06-03-2022: switching from relying on serverside to SWR
- 07-03-2022: none
- 08-03-2022: updating APi to use SWR
- 09-03-2022: added show loading / error 
- 10-03-2022: adding mutate to category, and updating ui state adn requirement, transition, update index page
