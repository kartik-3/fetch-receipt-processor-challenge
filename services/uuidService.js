/**
 * Used UUID package to generate a Unique ID for points.
 */
const { v4: uuidv4 } = require("uuid");

exports.generateUuid = () => uuidv4();
