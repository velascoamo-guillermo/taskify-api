import app from "./app.ts";
import logger from "./utils/logger.ts";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`🚀 Server running on http://localhost:${port}`);
});
