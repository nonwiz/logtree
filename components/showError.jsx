import Link from "next/link";

function ShowError() {
  return (
    <div className="absolute inset-0 h-screen w-screen">
      <div className="p-2 sm:mt-[28vh]">
        <img
          src="/undraw_to_the_moon_re_q21i.svg"
          className="w-60 bg-gray-700 rounded-xl mx-auto"
        />
        <p className="p-2 mt-4 text-center">
          Be sure to login and create a topic first.
          <br />
          <Link href="/">
            <a className="text-sky-600 underline">Go home</a>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ShowError;
