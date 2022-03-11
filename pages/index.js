import { Welcome } from "@/components/welcome";

export default function Home({ updated }) {
  return (
    <div>
      <p className="fixed bottom-0 right-0 opacity-50">{updated}</p>
      <Welcome />
    </div>
  );
}

export async function getStaticProps() {
  const bd = new Date();
  const exportDate = `${bd.getMonth()}-${bd.getDay()}-${bd.toLocaleTimeString()}`;
  return {
    props: {
      updated: exportDate,
    },
  };
}
