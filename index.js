const fs = require("fs/promises");
const { Buffer } = require("node:buffer");

const createFile = async (file_path) => {
  try {
    const existingfilehandle = await fs.open(file_path, "r");
    existingfilehandle.close();
    console.log("file is already created");
  } catch (err) {
    const newfilehandle = await fs.open(file_path, "w");
    newfilehandle.close();
    console.log("file created successfully");
  }
};

(async () => {
  const CREATE_FILE = "create a file";

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

    await commandFileHandler.read(buff, offset, length, position);
    const command = ("string data", buff.toString("utf-8"));

    if (command.includes(CREATE_FILE)) {
      const file_path = command.substring(CREATE_FILE.length + 1);
      createFile(file_path);
    }
  });

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
