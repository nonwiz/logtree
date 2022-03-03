# Logtree

Inspired by avanier, this project include several mini apps inside such as tracker [time, link, and activity], url shortner, and file storage and many more.

# Time tracker: 
- exporting records / importing records
- Ability to archive.


Like any other time tracker app, this include the duration of the activity that you track, there is nothing special.
- Split API routing properly.

# Issue tracking 
- Don't let other user crud other user records like timers, solution ? check if the user owned that property or where condition in prisma?
- Dont let user delete other person record, check if the record is owned by the individual first.
- change tid into timerId @timer.jsx and api/timer/index
- /pages/timer : when there is no data to be parsed, it shows error
- Is relying on one model subset one model is a good thing to do?


# UI Brainstorming
- Instead of drop down, how about select on a listed label and highlight it?
- Category or Topic Create Form available universally?
- Confirm the deletion of the topic or category?

# Framework
Built with Nextjs + NextAuth + PlanetScale + Prisma + TailwindCSS

# Huggingface
This is just some bonus for fun.


# Structure

## Home Page:
- Able to create/delete Category (Topic)
- See the ongoing tracking, recent notes, recent links

# To do:
- Make a To do - sharable one.
- add keyboard shortcut

## Log
- 02-03-2022: update the dashboard
- 03-03-2022: rename timer to tracker
