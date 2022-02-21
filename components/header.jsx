import { useSession, signOut } from "next-auth/react";

function Header(props) {
  const { data: session } = useSession();
  console.log(session);
  const links = [
    { label: "Timer", link: "/timer" },
    { label: "Links", link: "" },
    { label: "Activity", link: "" },
    { label: "URL Master", link: "" },
  ];
  return (
    <>
      <div className="p-2 flex flex-wrap justify-between border border-b-gray-300">
        <div>
          {" "}
          <span className="bg-gray-800 text-gray-100 p-1 rounded-md">
            <a href="/">LOGTREE</a>
          </span>
          <span>:-</span>
          <span className="space-x-2">
            {links.map((item, id) => (
              <a
                href={item.link}
                className="hover:underline active:underline decoration-dashed"
                key={id}
              >
                {" "}
                {item.label}{" "}
              </a>
            ))}
          </span>
        </div>
        <div className="flex flex-row gap-2">
          {session?.user?.image && (
            <img
              src={session.user.image}
              className="w-8 h-8 rounded-full border border-gray-400"
              layout="fill"
            />
          )}

          {!session ? (
            <a href="/api/auth/signin"> Sign in </a>
          ) : (
            <button onClick={() => signOut()}>Sign out </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
