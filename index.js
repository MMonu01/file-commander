const fs = require("fs/promises");
const { Buffer } = require("node:buffer");

(async () => {
  const watcher = fs.watch("./command.txt");

  const commandFileHandler = await fs.open("./command.txt");

  commandFileHandler.on("change", async () => {
    // get the size of our file
    const size = (await commandFileHandler.stat()).size;

    //buffer to fill the data from file with the size of the file
    const buff = Buffer.alloc(size);

    //starting posisiton of buffer to fill our buffer
    const offset = 0;

    //how many bytes we want to read
    const length = buff.byteLength;

    // position from which to start reading the file
    const position = 0;

    const content = await commandFileHandler.read(
      buff,
      offset,
      length,
      position
    );
    console.log(content);
  });

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
