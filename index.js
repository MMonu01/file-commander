const fs = require("fs/promises");
const {Buffer} = require("node:buffer");

(async () => {
const  commandFileHandler = await fs.open("./command.txt")

  const watcher = fs.watch("./command.txt");

  for await (const event of watcher) {
    if (event.eventType === "change") {
      console.log("something has changed");
//	console.log(commandFileHandler)
	// get the file size
	const size  = (await commandFileHandler.stat()).size;

	//buffer to store the data read
	const buff =  Buffer.alloc(size);

	const offset = 0
	const length = buff.byteLength;
	const position = 0
	console.log(buff);
	const content = await commandFileHandler.read(buff,offset,length,position);
	console.log(content);
  }
  }
})();
