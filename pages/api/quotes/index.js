import Cors from "cors";
import initMiddleware from "@/middleware";

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "POST", "OPTIONS"],
  })
);

export default async function handler(req, res) {
  // Run cors
  await cors(req, res);
  const { url } = req.body;
  const result = await fetch(url, {
    method: "GET",
  }).then((r) => r.json());
  res.status(200).json(result);
}
