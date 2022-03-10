import { useState, useEffect } from "react";
import HL from "@/components/horizontalLine";

export const Welcome = (data) => {
  return (
    <>
      <div className="rounded-tl-xl rounded-tr-xl bg-gray-800 text-gray-50 py-40 p-4 text-center">
        <h1> Welcome </h1>
        <div className="flex justify-center">
          <HL widths={[20, 20]} color="bg-gray-50" />
        </div>

        <p className="text-sm text-gray-50">
          Tracker | Link Manager | Note Keeper
        </p>
      </div>
      <div className="my-16 p-2 flex flex-col">
        <div className="">
          <h2> What is logtree </h2>
          <HL widths={[20, 20]} />

          <p className="mb-4">
            A progressive platform that aim to improve the users productivity
            and fun!
          </p>
        </div>
        <div className=" w-full flex flex-col md:flex-row gap-2 justify-between">
          <details className="md:w-80 p-2 border-2 border-gray-800" open>
            <summary> Time Tracking </summary>
            <p>
              allow you to track time without worrying of accidentally close the
              tab.
            </p>
          </details>

          <details className="md:w-80 p-2 border-2 border-gray-800" open>
            <summary> Links Manager </summary>
            <p>save any links according to the topic.</p>
          </details>

          <details className="md:w-80 p-2 border-2 border-gray-800" open>
            <summary> Notes Keeper </summary>
            <p>store and edit any note associate to topic</p>
          </details>
        </div>
      </div>
      <div className="bg-gray-800 text-gray-50 py-10 my-10 p-4 text-center">
        <h2> Other features? </h2>
        <div className="flex justify-center">
          <HL widths={[20, 20]} color="bg-gray-50" />
        </div>

        <p className="text-sm text-gray-50">
          More to come, but here is the beta features:
        </p>
      </div>

      <div className="p-2">
        <h2> Keyboard command! </h2>
        <HL widths={[20, 20]} />
        <p>
          {" "}
          When on wider screen, press [`] to activate the master command. More
          commands will be added later, here are the currently available
          commands for use.{" "}
        </p>
      </div>
      <div className="bg-gray-800 h-80 text-gray-50 p-4 rounded-br-xl rounded-bl-xl">
        {/* Keyboard feature */}
        <h2> Switch pages: </h2>
        <span> ⤷ </span>
        <div className="inline-block" id="command">
          links
        </div>
        <hr />
        <div>
          <p className="text-rose-300 text-sm "> Loading links page! </p>
        </div>
        <div className="my-1 text-xs text-teal-500">
          # Press [`] then type the available pages: <br /> # ["home",
          "tracker", "links", "notes"]
        </div>
        <br />
        <div className="text-right">
          <h2> Other commands: </h2>
          <div className="inline-block" id="command">
            <span> ⤷ </span>
            ct [topic name]
          </div>
          <hr />
          <div>
            <p className="text-rose-300 text-sm "> Creating [topic name] </p>
          </div>
        </div>
        <div className="my-1 text-xs text-right text-teal-500">
          # Ex. ct sideproject # Creating sideproject! <br /># Other commands:
          login, logout
        </div>
      </div>

      <div>
        <p className="text-yellow-700 p-2">
          !Note: When running function like create, you will need to reload the
          page manually, for now :({" "}
        </p>
      </div>
    </>
  );
};
