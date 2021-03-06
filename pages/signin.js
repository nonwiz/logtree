import { getProviders, signIn, getSession } from "next-auth/react";
import Link from "next/link";

function Signin({ providers }) {
  return (
    <div className="absolute inset-0 h-screen w-screen bg-gray-800 overflow-hidden">
      <div className="p-2 mt-[25vh] sm:mt-[18vh] flex justify-center overflow-hidden">
        <div className="flex flex-row gap-4 space-x-2">
          <div className="hidden md:block">
            <img
              src={"/undraw_access_account_re_8spm.svg"}
              className="w-80 bg-gray-800 p-4 rounded-md"
            />
          </div>
          <div className="p-2 text-gray-50">
            <img src="/logo.png" className="w-20 rounded-md invert mx-auto" />
            <h1 className="text-center"> Sign in </h1>
            <hr className="my-2" />
            {Object.values(providers).map((provider) => {
              return (
                <div key={provider.name}>
                  <button
                    className="border-2 border-solid m-1 border-gray-50 w-56 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-800"
                    onClick={(e) => {
                      e.target.textContent = "Processing ...";
                      e.target.disable = true;
                      signIn(provider.id, {
                        callbackUrl: `${window.location.origin}/dashboard`,
                      });
                      setTimeout(() => {
                        e.target.textContent = `${provider.name}`;
                        e.target.disable = false;
                      }, 3000);
                    }}
                  >
                    {provider.name}
                  </button>
                </div>
              );
            })}
            <div className="text-center mt-2">
              <Link href="/">
                <a className="text-center text-sky-50 hover:underline">
                  Go Home
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });
  if (session && res) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  const providers = await getProviders();
  return {
    props: { providers },
  };
}
