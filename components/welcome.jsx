export const Welcome = (data) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="w-auto sm:border-gray-800 sm:border-r-2 p-1 sm:h-screen sm:w-86 md:w-[60vw] lg:w-[40vw]">
        <h1> Logtree's Index </h1>
        <details open>
          <summary>Real summary</summary>
          <ul className="list-disc px-4 text-gray-600">
            <li>Topic: let you link and connect to other modules</li>
            <li>
              Tracker: allow you to track time without worrying of accidentally
              close the tab.
            </li>
            <li>Links: save any links according to the topic.</li>
            <li>Notes: store and edit any note associate to topic.</li>
          </ul>
        </details>
        <details>
          <summary>Topic</summary>
          <p>
            One of the core model within Logtree is the topic, in the backend db
            known as category, which is the association between user and other
            module like Tracker, Links, Notes, etc...
          </p>
        </details>
        <details>
          <summary>Tracker</summary>
          <p>
            This module allow you to track the time you spent on each certain
            topic, you can stop / stop / resume the tracking. This is
            server-side based tracker, which mean you don't have to worry if you
            accidentally close the tab as long as you have access to the
            internet and browser, you can open it to continue.
          </p>
        </details>

        <details>
          <summary>Links</summary>
          <p>You can store links according to topic or category.</p>
        </details>

        <details>
          <summary>Notes</summary>
          <p>
            Like Links, but instead, you can use markdown syntax here, this is
            instead for storing notes.
          </p>
        </details>
      </div>
      <div>
        <div className="w-full md:w-[60vw] p-2">
          <details open>
            <summary> What's this? </summary>
            <p>
              This is logtree, a platform compile a lot of useful productivity
              applications together in one bundle and learn users use it easely.
            </p>
          </details>
          <details open>
            <summary> The Inspiration </summary>
            <p className="break-word">
              About a year ago or longer, I was fairly new to programming. I was
              delight when one of my inspiration (Avanier) showed me of what he
              had made. Many of his applications and program were for improving
              his own productivity. From then on, I determined that I would try
              my best to make one to improve myself as well. A lot of things
              happen later on that I got delay until now.
            </p>
            <p>That's it.</p>
          </details>
          <details>
            <summary> The Idea </summary>
            <p>
              There are many things that constantly bugging me. One of them is
              about time management, many times that I wonder how much time I
              have work on this specific project?
            </p>
            <p>
              Two, I want to make a short note using other computers or just
              simply for copy paste and store it properly.
            </p>
            <p>
              There were variety of useful resources that I really like to
              explore and I did, I didn't pay much attention for a while, and
              now my bookmark is super clutter right now. There are many useless
              stuff that I store and now it also had buried those I have
              considered imporant.
            </p>
            <p>
              Now this era where I have to worry on security, I also not
              comfortable constantly login and using two authentication for so
              many times on different devices. So I just wished that I am able
              to just login once and yeah the other app follow the same way.
            </p>
            <p>
              Last of all, I also wish that I can keep improving this project
              and adding more stuff as well whether for fun or learning
            </p>
          </details>
          <details>
            <summary> The Goal </summary>
            <p>
              Upon brainstorming upon this idea, I decide to start working on a
              tracker first in which I can track my time and category I spent,
              then make a link storage in which to save and category the links
              that I saved; and lastly is a short term note.
            </p>
          </details>
          <details>
            <summary> The Timeframe </summary>
            <p>
              {" "}
              I didn't really set any timeframe for this project, but I wanted
              to add the functionality that I need at least by the end of March
              2022.
            </p>
          </details>
          <details>
            <summary> Credits </summary>
            <p>
              I don't know if Miki Szeles would see this page, but yeah I was
              browsing and found oen of your blog post, I don't know if I like
              but yeah, but it gaves me some plagiarism idea on how to write
              this welcome page here, so thank you!{" "}
            </p>
          </details>
          <details>
            <summary> Framework behind this</summary>
            <p>This project is made with:</p>
            <ul className="list-disc px-4 text-gray-600">
              <li>Hosting: Github + Vercel </li>
              <li>Database: PlanetScale</li>
              <li>ORM: Prisma</li>
              <li>Backend: Nextjs</li>
              <li>Frontend: TailwindCSS</li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
};
