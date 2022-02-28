import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

function Header(props) {
  const { data: session } = useSession();
  const links = [
    { label: "Timer", link: "/timer" },
    { label: "Links", link: "/linker" },
    { label: "Activity", link: "/" },
    { label: "URL Master", link: "/" },
    { label: "Hugging Face", link: "huggingface" },
  ];
  return (
    <>
      <div className="p-2 flex flex-wrap justify-between border border-b-gray-300">
        <div>
          {" "}
          <span className="bg-gray-800 text-gray-100 p-1 rounded-md">
            <Link href="/">LOGTREE</Link>
          </span>
          <span>:-</span>
          <span className="space-x-2">
            {links.map((item, id) => (
              <Link
                href={item.link}
                className="hover:underline active:underline decoration-dashed"
                key={id}
              >
                <a>{item.label}</a>
              </Link>
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
            <Link href="/api/auth/signin"> Sign in </Link>
          ) : (
            <button onClick={() => signOut()}>Sign out </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
