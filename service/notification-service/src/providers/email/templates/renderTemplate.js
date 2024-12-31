const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const renderTemplate = (templateName, data) => {
  const template = fs.readFileSync(
    path.join(__dirname, `${templateName}.html`),
    "utf8"
  );
  const compiledTemplate = handlebars.compile(template);
  return compiledTemplate(data);
};

module.exports = renderTemplate;