const fs = require("fs/promises");
const { Buffer } = require("node:buffer");

const createFile = async (file_path) => {
  try {
    const existingfilehandle = await fs.open(file_path, "r");
    existingfilehandle.close();
    console.log(file_path, "file is already created");
  } catch (err) {
    const newfilehandle = await fs.open(file_path, "w");
    newfilehandle.close();
    console.log(file_path, "file created successfully");
  }
};

const deleteFile = async (file_path) => {
  try {
    await fs.unlink(file_path);
    console.log(file_path, "file deleted successfullly");
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("no such file to remove");
    } else {
      console.log("something went wrong while deleting the file");
      console.log(err);
    }
  }
};

const renameFile = async (old_file_path, new_file_path) => {
  try {
    await fs.rename(old_file_path, new_file_path);
    console.log(old_file_path, "renamed to ", new_file_path, "successfully");
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("no such file to rename or destination does not exits");
    } else {
      console.log("something went wrong while renaming the file");
      console.log(err);
    }
  }
};

const addToFile = async (file_path, content) => {
  try {
    const filehandle = await fs.open(file_path, "a");

    await filehandle.appendFile(content);

    console.log("added to the file", file_path, " with content: ", content);

    filehandle.close();
  } catch (err) {
    console.log("something went wrong while adding content to file");
    console.log(err);
  }
};

(async () => {
  const CREATE_FILE = "create a file"; //eg. create a file one.js
  const DELETE_FILE = "delete the file"; //eg. delete the file one.js
  const RENAME_FILE = "rename the file"; //eg. rename the file one.js to two.js
  const ADD_TO_FILE = "add to the file"; //eg. add to file two.js with content: whatever the content is...

  const commandFileHandler = await fs.open("./command.txt");

  const watcher = fs.watch("./command.txt");

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
    const command = ("string data", buff.toString("utf-8")).trim();

    // create a file <path>
    if (command.includes(CREATE_FILE)) {
      const file_path = command.substring(CREATE_FILE.length + 1);
      createFile(file_path);
    }

    // delete the file <path>
    if (command.includes(DELETE_FILE)) {
      const file_path = command.substring(DELETE_FILE.length + 1);
      deleteFile(file_path);
    }

    // rename the file <old_path> to <new_path>
    if (command.includes(RENAME_FILE)) {
      const support_content_index = command.indexOf(" to ");
      const support_content_length = " to ".length;

      const old_file_path = command.substring(
        RENAME_FILE.length + 1,
        support_content_index
      );

      const new_file_path = command.substring(
        support_content_index + support_content_length
      );

      renameFile(old_file_path, new_file_path);
    }

    // add to the file <path> with content: <data>
    if (command.includes(ADD_TO_FILE)) {
      const support_content_index = command.indexOf(" with content: ");
      const support_content_length = " with content: ".length;

      const file_path = command.substring(
        ADD_TO_FILE.length + 1,
        support_content_index
      );

      const content = command.substring(
        support_content_index + support_content_length
      );

      addToFile(file_path, content);
    }
  });

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
