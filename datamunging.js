let headings = [];
let ageGroupIndex = 0;
let literatePersons = 0;
const educationCategoryindexs = [];
const educationCategoryDict = [];
const educationCategoryHeading = [];
const ageMapDict = {};
let fileNo = 0;
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');

function getEducationCategoryValues(heading) {
  for (let i = 0; i < heading.length; i += 1) {
    if (heading[i].trim().startsWith('Educational level')) {
      const tempHeading = heading[i].split('Educational level - ')[1];
      const lastIndex = tempHeading.lastIndexOf('-');
      const finalHeading = tempHeading.substring(0, lastIndex);
      if (!(finalHeading in educationCategoryDict)) {
        educationCategoryDict[finalHeading] = 0;
        educationCategoryHeading.push(finalHeading);
        educationCategoryindexs.push(i);
      }
      i += 2;
    }
  }
}

function getHeadingValues(line) {
  headings = line.split(',');
  ageGroupIndex = headings.indexOf('Age-group');
  literatePersons = headings.indexOf('Literate - Persons');
  getEducationCategoryValues(headings);
}

function consolidateData(line) {
  const dataLine = line.split(',');
  if (!(dataLine[ageGroupIndex] in ageMapDict)) {
    ageMapDict[dataLine[ageGroupIndex]] = 0;
  }
  ageMapDict[dataLine[ageGroupIndex]] += parseInt(dataLine[literatePersons], 10);
  Object.keys(educationCategoryHeading).forEach((data) => {
    educationCategoryDict[educationCategoryHeading[data]] += parseInt(dataLine[educationCategoryindexs[data]], 10);
  });
}

function writeToFile(fileToStream, dict, keyValueName) {
  const writeStreamVar = fs.createWriteStream(fileToStream);
  writeStreamVar.write('[\n');
  let isFirstEntery = true;
  Object.keys(dict).forEach((i) => {
    if (isFirstEntery) {
      writeStreamVar.write(`{\n\t"age_group" : "${i}",\n\t"number" : ${dict[i]}}\n`);
      isFirstEntery = !isFirstEntery;
    } else { writeStreamVar.write(`,{\n\t"${keyValueName}" : "${i}",\n\t"number" : ${ageMapDict[i]}}\n`); }
  });
  writeStreamVar.write(']\n');
  writeStreamVar.end();
}

function readAsync(fileName) {
  let isheading = true;
  function main(line) {
    if (isheading) {
      if (fileNo === 0) { getHeadingValues(line); }
      isheading = false;
    } else {
      consolidateData(line);
    }
  }
  const instream = fs.createReadStream(fileName);
  const outstream = new stream();
  const rl = readline.createInterface(instream, outstream);
  rl.on('line', (line) => {
    main(line);
  });
  rl.on('close', (line) => {
    fileNo += 1;
    if (fileNo === 3) {
      const basePath = './output/';
      writeToFile(`${basePath}age_map.json`, ageMapDict, 'age_group');
      writeToFile(`${basePath}education_category.json`, ageMapDict, 'Education_Category');
    }
  });
}

function init() {
  const basePath = './input/';
  readAsync(` ${basePath} + India2011.csv`);
  readAsync(` ${basePath} + IndiaSC2011.csv`);
  readAsync(` ${basePath} + IndiaST2011.csv`);
}

init();

